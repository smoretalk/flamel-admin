import React, {ChangeEventHandler, useEffect, useState} from "react";
import { useTranslation } from 'adminjs';
import { FilesetResolver, ImageEmbedder } from '@mediapipe/tasks-vision';
import { FilesetResolver as TextFilesetResolver, TextEmbedder } from '@mediapipe/tasks-text';
import axios from "axios";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ImageEmbed: React.FC = () => {
  const [embedder, setEmbedder] = useState<ImageEmbedder>(null);
  const [textEmbedder, setTextEmbedder] = useState<TextEmbedder>(null);
  const [value, setValue] = useState('');
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
    const response2 = await axios.get<{ imageId: number; CollectionInfo: { stylePrompt: string | null }; GenerationInfo: { fullPrompt: string | null } }[]>(`/api/collections/noTextEmbedding`);
    console.log(response2.data, textEmbedder);
    for (const r of response2.data) {
      if (!r.CollectionInfo?.stylePrompt && !r.GenerationInfo?.fullPrompt) {
        continue;
      }
      const textEmbedderResult = textEmbedder.embed(r.CollectionInfo?.stylePrompt || r.GenerationInfo?.fullPrompt);
      console.log(r.imageId, textEmbedderResult, r.CollectionInfo?.stylePrompt || r.GenerationInfo?.fullPrompt);
      await axios.patch(`/api/collections/${r.imageId}/textEmbed`, {
        vector: JSON.stringify(textEmbedderResult.embeddings[0].floatEmbedding),
      });
    }
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
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

  return (
    <div>
      <img id='image' alt='' width={256} height={256} />
      <button onClick={onStart}>이미지 임베딩 시작</button>
      <button onClick={onTextStart}>텍스트 임베딩 시작</button>
      <br/>
      <input value={value} onChange={onChange} />
      <button onClick={onClick}>이미지 유사도 조회</button>
      <button onClick={onTextClick}>텍스트 유사도 조회</button>
      <div>
        {result.slice(0, 20).map((v) => (
          <div>
            <img src={`/api/admin/images/${v.imageId}/thumb`} alt=""  width={128} height={128}/>
            <div>{v.imageId} {v.similar}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageEmbed;
