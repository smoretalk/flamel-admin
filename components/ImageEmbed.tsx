import React, {ChangeEventHandler, useEffect, useState} from "react";
import { useTranslation } from 'adminjs';
import { FilesetResolver, ImageEmbedder } from '@mediapipe/tasks-vision';
import axios from "axios";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ImageEmbed: React.FC = () => {
  const { translateMessage } = useTranslation();
  const [embedder, setEmbedder] = useState<ImageEmbedder>(null);
  const [src, setSrc] = useState<string>('');

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
      setEmbedder(imageEmbedder);
      const response = await axios.post('/admin/api/resources/Image/actions/list?filters.CollectionInfo.enabled=true&perPage=0')
      const total = response.data.meta.total;
      const response2 = await axios.post<{ records: { id:number; params: { Owner: number }}[] }>(`/admin/api/resources/Image/actions/list?filters.CollectionInfo.enabled=true&perPage=${total}`);
      console.log(response2.data.records);
      for (const r of response2.data.records) {
        const htmlImageElement = document.querySelector('#image') as HTMLImageElement;
        await sleep(2000);
        htmlImageElement.src = `/api/admin/owners/${r.params.Owner}/images/${r.id}`;
        const imageEmbedderResult = embedder.embed(htmlImageElement);
        console.log(r.id, imageEmbedderResult);
      }
    }
    main();
  }, []);

  return (
    <div>
      <img id='image' src={src} alt='' width='512' height='512' />
    </div>
  );
};

export default ImageEmbed;
