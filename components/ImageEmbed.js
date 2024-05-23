import React, { useEffect, useState } from "react";
import { FilesetResolver, ImageEmbedder } from '@mediapipe/tasks-vision';
import axios from "axios";
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const ImageEmbed = () => {
    const [embedder, setEmbedder] = useState(null);
    const [value, setValue] = useState('');
    useEffect(() => {
        async function main() {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
            const imageEmbedder = await ImageEmbedder.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite`
                },
            });
            setEmbedder(imageEmbedder);
        }
        main();
    }, []);
    const onStart = async () => {
        const response = await axios.post('/admin/api/resources/Image/actions/list?filters.CollectionInfo.enabled=true&perPage=0');
        const total = response.data.meta.total;
        const response2 = await axios.post(`/admin/api/resources/Image/actions/list?filters.CollectionInfo.enabled=true&perPage=${total}`);
        console.log(response2.data.records, embedder);
        for (const r of response2.data.records) {
            const htmlImageElement = document.querySelector('#image');
            htmlImageElement.src = `/api/admin/images/${r.id}/binary`;
            await sleep(2000);
            const imageEmbedderResult = embedder.embed(htmlImageElement);
            console.log(r.id, imageEmbedderResult);
            await axios.patch(`/api/collections/${r.id}/imageEmbed`, {
                vector: JSON.stringify(imageEmbedderResult.embeddings[0].floatEmbedding),
            });
        }
    };
    const onChange = (e) => {
        setValue(e.target.value);
    };
    const onClick = async () => {
        const response = await axios.get(`/api/collections/imageEmbed?take=1000`);
        const target = response.data.find((v) => v.imageId.toString() === value);
        const result = response.data.map((v) => {
            const similar = ImageEmbedder.cosineSimilarity({ floatEmbedding: JSON.parse(target.imageEmbedding), headName: 'feature', headIndex: 0 }, { floatEmbedding: JSON.parse(v.imageEmbedding), headName: 'feature', headIndex: 0 });
            return {
                imageId: v.imageId,
                similar,
            };
        }).toSorted((a, b) => b.similar - a.similar);
        console.log(result);
    };
    return (React.createElement("div", null,
        React.createElement("img", { id: 'image', alt: '', width: '512', height: '512' }),
        React.createElement("button", { onClick: onStart }, "\uC2DC\uC791"),
        React.createElement("input", { value: value, onChange: onChange }),
        React.createElement("button", { onClick: onClick }, "\uC870\uD68C"),
        React.createElement("div", null)));
};
export default ImageEmbed;
//# sourceMappingURL=ImageEmbed.js.map