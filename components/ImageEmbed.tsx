import React, {ChangeEventHandler, useEffect, useState} from "react";
import { useTranslation } from 'adminjs';
import { FilesetResolver, ImageEmbedder } from '@mediapipe/tasks-vision';
import axios from "axios";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ImageEmbed: React.FC = () => {
  useEffect(() => {
    async function main() {
      const vision = await FilesetResolver.forVisionTasks(
        // path/to/wasm/root
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const imageEmbedder = await ImageEmbedder.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite`
        },
      });
      const response = await axios.post('/admin/api/resources/Image/actions/list?filters.CollectionInfo.enabled=true&perPage=0')
      const total = response.data.meta.total;
      const response2 = await axios.post<{ records: { id:number; params: { Owner: number }}[] }>(`/admin/api/resources/Image/actions/list?filters.CollectionInfo.enabled=true&perPage=${total}`);
      console.log(response2.data.records, imageEmbedder);
      for (const r of response2.data.records) {
        const htmlImageElement = document.querySelector('#image') as HTMLImageElement;
        htmlImageElement.src = `/api/admin/images/${r.id}/binary`;
        await sleep(2000);
        const imageEmbedderResult = imageEmbedder.embed(htmlImageElement);
        console.log(r.id, imageEmbedderResult);
        await axios.patch(`/api/collections/${r.id}/imageEmbed`, {
          vector: JSON.stringify(imageEmbedderResult.embeddings[0].floatEmbedding),
        });
      }
    }
    main();
  }, []);

  return (
    <div>
      <img id='image' alt='' width='512' height='512' />
    </div>
  );
};

export default ImageEmbed;
