import React, {ChangeEventHandler, useEffect, useState} from "react";
import { FilesetResolver, ImageEmbedder } from '@mediapipe/tasks-vision';
import { FilesetResolver as TextFilesetResolver, TextEmbedder } from '@mediapipe/tasks-text';
import axios from "axios";
import { Palette } from 'auto-palette';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Result = { imageId: number; similar?: string; text?: string };
export const ImageEmbed: React.FC = () => {
  const [embedder, setEmbedder] = useState<ImageEmbedder>(null);
  const [textEmbedder, setTextEmbedder] = useState<TextEmbedder>(null);
  const [value, setValue] = useState('');
  const [color1, setColor1] = useState('');
  const [color2, setColor2] = useState('');
  const [color3, setColor3] = useState('');
  const [color4, setColor4] = useState('');
  const [color5, setColor5] = useState('');
  const colorSetter = [setColor1, setColor2, setColor3, setColor4, setColor5];
  const [disabled, setDisabled] = useState(true);
  const [color, setColor] = useState('');
  const [result, setResult] = useState<Result[]>([]);

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

  const convertToHex = (color: number) => {
    if(color < 0){color = 0}
    else if(color > 255){color = 255};
    const hex = color.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  const rgb2hex = (r: number, g: number, b: number) => (
    (convertToHex(r) + convertToHex(g) + convertToHex(b)).toUpperCase()
  )

  const onColorStart = async () => {
    const response2 = await axios.get<{ imageId: number; }[]>(`/api/collections/noColors`);
    console.log(response2.data);
    const image = document.querySelector('#image') as HTMLImageElement;
    for (const r of response2.data) {
      await new Promise((resolve, reject) => {
        console.log(r);
        const loadEvent = async function() {
          const palette = Palette.extract(image, {
            maxSwatches: 5,
            filters: [],
          });
          const swatches = palette.findSwatches(5);

          console.log(swatches);
          for (const setter of colorSetter) {
            setter('');
          }
          let i = 0;
          for (const rr of swatches) {
            const lab = rr.color.toLAB();
            const rgb = rr.color.toRGB();
            const hex = '#' + rgb2hex(rgb.r, rgb.g, rgb.b);
            colorSetter[i](hex);
            console.log(r.imageId, lab, rgb, hex, rr.population, rr.name);
            // await axios.post(`/api/collections/${r.imageId}/colors`, {
            //   color: [lab.l, lab.a, lab.b],
            //   rgb: hex,
            //   percentage: rr.population,
            // })
            i++;
          }
          image.removeEventListener('load', loadEvent)
          setTimeout(() => {
            resolve(result);
          }, 2000)
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
        similar: similar.toString(),
      }
    }).toSorted((a, b) => parseFloat(b.similar) - parseFloat(a.similar));
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
        similar: similar.toString(),
      }
    }).toSorted((a, b) => parseFloat(b.similar) - parseFloat(a.similar));
    console.log(result);
    setResult(result);
  }

  const onColorClick = async () => {
    // const response = await axios.get<{ imageId: number; }[]>(`/api/collections/${color}/similarColors`);
    // setResult(response.data);
    // const rgb = color.split(',').map((v) => parseFloat(v)) as [number, number, number];
    // const lab = rgb2lab(rgb);
    // const response = await axios.get<{ imageId: number; color: string; dominant: boolean; similar?: number }[]>(`/api/collections/allColors`);
    // response.data.forEach((color) => {
    //   const lab2 = color.color.split(',').map((v) => parseFloat(v.replace(/[()]/g, ''))) as [number, number, number]
    //   color.similar = deltaE(lab, lab2);
    // });
    // const uniq = (arr: { imageId: number }[], track = new Set()) =>
    //   arr.filter(({ imageId }) => (track.has(imageId) ? false : track.add(imageId)));
    // const sorted = response.data.toSorted((a, b) => a.similar - b.similar);
    // const unique = uniq(sorted);
    // console.log(unique);
    // setResult(unique);
  };

  return (
    <div>
      <img id='image' alt='' width={256} height={256}/>
      <br/>
      <input type="color" id="color1" name="head" value={color1}/>
      <input type="color" id="color2" name="head" value={color2}/>
      <input type="color" id="color3" name="head" value={color3}/>
      <input type="color" id="color4" name="head" value={color4}/>
      <input type="color" id="color5" name="head" value={color5}/>
      <br/>
      <button onClick={onStart} disabled={disabled}>이미지 임베딩 시작</button>
      <button onClick={onTextStart} disabled={disabled}>텍스트 임베딩 시작</button>
      <button onClick={onColorStart}>컬러 팔레트 시작</button>
      <br/>
      <input value={value} onChange={onChange}/>
      <button onClick={onClick} disabled={disabled}>이미지 유사도 조회</button>
      <button onClick={onTextClick} disabled={disabled}>텍스트 유사도 조회</button>
      <br/>
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
