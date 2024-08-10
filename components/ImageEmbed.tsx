import React, {ChangeEventHandler, useEffect, useState} from "react";
import { FilesetResolver, ImageEmbedder } from '@mediapipe/tasks-vision';
import { FilesetResolver as TextFilesetResolver, TextEmbedder } from '@mediapipe/tasks-text';
import axios from "axios";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ImageEmbed: React.FC = () => {
  const [embedder, setEmbedder] = useState<ImageEmbedder>(null);
  const [textEmbedder, setTextEmbedder] = useState<TextEmbedder>(null);
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [color, setColor] = useState('');
  const [result, setResult] = useState<{ imageId: number; similar?: number; text?: string}[]>([]);

  useEffect(() => {
    async function main() {
      const [vision, text] = await Promise.all([
        FilesetResolver.forVisionTasks(
          // path/to/wasm/root
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        ),
        TextFilesetResolver.forTextTasks(
          // path/to/wasm/root
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text/wasm"
        ),
      ]);
      const [imageEmbedder, textEmbedder] = await Promise.all([
        ImageEmbedder.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite`
          },
        }),
        TextEmbedder.createFromModelPath(text,
          "https://storage.googleapis.com/mediapipe-models/text_embedder/universal_sentence_encoder/float32/1/universal_sentence_encoder.tflite"
        ),
      ]);
      setEmbedder(imageEmbedder);
      setTextEmbedder(textEmbedder);
      alert('모델 준비 완료');
      setDisabled(false);
    }
    main();
  }, []);

  const onStart = async () => {
    const response2 = await axios.get<{ imageId: number }[]>(`/api/collections/noImageEmbedding`);
    console.log(response2.data, embedder);
    for (const r of response2.data) {
      const htmlImageElement = document.querySelector('#image') as HTMLImageElement;
      htmlImageElement.src = `/api/admin/images/${r.imageId}/binary`;
      await sleep(2000);
      const imageEmbedderResult = embedder.embed(htmlImageElement);
      console.log(r.imageId, imageEmbedderResult);
      await axios.patch(`/api/collections/${r.imageId}/imageEmbed`, {
        vector: JSON.stringify(imageEmbedderResult.embeddings[0].floatEmbedding),
      });
    }
  };

  const onTextStart = async () => {
    const response2 = await axios.get<{ imageId: number; koTitle: string | null; enTitle: string | null; fullPrompt: string | null }[]>(`/api/collections/allTextEmbedding`);
    console.log(response2.data, textEmbedder);
    const map = new Map<number, { en: Set<string>, ko: Set<string>, full: string }>();
    for (const r of response2.data) {
      const obj = map.get(r.imageId);
      if (obj) {
        obj.en.add(r.enTitle);
        obj.ko.add(r.koTitle);
      } else {
        map.set(r.imageId, {
          en: new Set([r.enTitle]),
          ko: new Set([r.koTitle]),
          full: r.fullPrompt,
        });
      }
    }
    for (const m of map) {
      const textEmbedderResult = textEmbedder.embed(m[1].full + ' ' + Array.from(m[1].en).join(' ') + ' ' + Array.from(m[1].ko).join(' ' ));
      console.log(m, textEmbedderResult);
      await axios.patch(`/api/collections/${m[0]}/textEmbed`, {
        vector: JSON.stringify(textEmbedderResult.embeddings[0].floatEmbedding),
      });
    }
  };

  function rgb2lab(rgb: [number, number,number]){
    let r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      x, y, z;

    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

    return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)] as const;
  }

  function deltaE(labA: readonly [number, number, number], labB: readonly [number, number, number]){
    let deltaL = labA[0] - labB[0];
    let deltaA = labA[1] - labB[1];
    let deltaB = labA[2] - labB[2];
    let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    let deltaC = c1 - c2;
    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    let sc = 1.0 + 0.045 * c1;
    let sh = 1.0 + 0.015 * c1;
    let deltaLKlsl = deltaL / (1.0);
    let deltaCkcsc = deltaC / (sc);
    let deltaHkhsh = deltaH / (sh);
    let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
  }

  const onColorStart = async () => {
    const response2 = await axios.get<{ imageId: number; }[]>(`/api/collections/noColors`);
    console.log(response2.data);
    const colorThief = new window.ColorThief();
    const image = document.querySelector('#image') as HTMLImageElement;
    for (const r of response2.data) {
      await new Promise((resolve, reject) => {
        console.log(r);
        const loadEvent = async function() {
          const result = colorThief.getPalette(image);
          console.log(result);
          let i = 0;
          for (const rr of result.slice(0, 4)) {
            const lab = rgb2lab(rr);
            console.log('lab', lab, rr);
            await axios.post(`/api/collections/${r.imageId}/colors`, {
              hsv: lab.join(','),
              dominant: i === 0,
            })
            i++;
          }
          image.removeEventListener('load', loadEvent)
          resolve(result);
        };
        image.addEventListener('load', loadEvent);
        image.src = `/api/admin/images/${r.imageId}/binary`;
      })
    }
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value || '');
  }

  const onChangeColor: ChangeEventHandler<HTMLInputElement> = (e) => {
    setColor(e.target.value);
  }

  const onClick = async () => {
    const response = await axios.get<{ imageId: number; imageEmbedding: string }[]>(`/api/collections/imageEmbedding`);
    const target = response.data.find((v) => v.imageId.toString() === value);
    const result = response.data.map((v) => {
      const similar = ImageEmbedder.cosineSimilarity(
        { floatEmbedding: JSON.parse(target.imageEmbedding) as number[], headName: 'feature', headIndex: 0 },
        { floatEmbedding: JSON.parse(v.imageEmbedding) as number[], headName: 'feature', headIndex: 0 },
      );
      return {
        imageId: v.imageId,
        similar,
      }
    }).toSorted((a, b) => b.similar - a.similar);
    console.log(result);
    setResult(result);
  }

  const onTextClick = async () => {
    const response = await axios.get<{ imageId: number; imageEmbedding: string; textEmbedding: string; }[]>(`/api/collections/textEmbedding`);
    const target = response.data.find((v) => v.imageId.toString() === value);
    if (!target.textEmbedding) {
      return;
    }
    const result = response.data.map((v) => {
      if (!v.textEmbedding) {
        return { imageId: v.imageId };
      }
      const similar = TextEmbedder.cosineSimilarity(
        { floatEmbedding: JSON.parse(target.textEmbedding) as number[], headName: 'feature', headIndex: 0 },
        { floatEmbedding: JSON.parse(v.textEmbedding) as number[], headName: 'feature', headIndex: 0 },
      );
      return {
        imageId: v.imageId,
        similar,
      }
    }).toSorted((a, b) => b.similar - a.similar);
    console.log(result);
    setResult(result);
  }

  const onColorClick = async () => {
    // const response = await axios.get<{ imageId: number; }[]>(`/api/collections/${color}/similarColors`);
    // setResult(response.data);
    const rgb = color.split(',').map((v) => parseFloat(v)) as [number, number, number];
    const lab = rgb2lab(rgb);
    const response = await axios.get<{ imageId: number; color: string; dominant: boolean; similar?: number }[]>(`/api/collections/allColors`);
    response.data.forEach((color) => {
      const lab2 = color.color.split(',').map((v) => parseFloat(v.replace(/[()]/g, ''))) as [number, number, number]
      color.similar = color.dominant ? deltaE(lab, lab2) * 0.8 : deltaE(lab, lab2);
    });
    const sorted = response.data.toSorted((a, b) => a.similar - b.similar);
    console.log(sorted);
    setResult(Object.values(sorted.reduce((acc, obj) => ({ ...acc, [obj.imageId]: obj }), {})));
  };

  return (
    <div>
      <img id='image' alt='' width={256} height={256}/>
      <button onClick={onStart} disabled={disabled}>이미지 임베딩 시작</button>
      <button onClick={onTextStart} disabled={disabled}>텍스트 임베딩 시작</button>
      <button onClick={onColorStart}>컬러 팔레트 시작</button>
      <br/>
      <input value={value} onChange={onChange}/>
      <button onClick={onClick} disabled={disabled}>이미지 유사도 조회</button>
      <button onClick={onTextClick} disabled={disabled}>텍스트 유사도 조회</button>
      <input value={color} onChange={onChangeColor}/>
      <button onClick={onColorClick}>컬러 유사도 조회</button>
      <div>
        {result.slice(0, 20).map((v) => (
          <div>
            <img src={`/api/admin/images/${v.imageId}/thumb`} alt="" width={128} height={128}/>
            <div>{v.imageId} {v.similar}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageEmbed;
