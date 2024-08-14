import React, { useEffect, useState } from "react";
import { FilesetResolver, ImageEmbedder } from '@mediapipe/tasks-vision';
import { FilesetResolver as TextFilesetResolver, TextEmbedder } from '@mediapipe/tasks-text';
import axios from "axios";
import { Color, opacityFilter, Palette } from 'auto-palette';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const ImageEmbed = () => {
    const [embedder, setEmbedder] = useState(null);
    const [textEmbedder, setTextEmbedder] = useState(null);
    const [value, setValue] = useState('');
    const [color1, setColor1] = useState('');
    const [color2, setColor2] = useState('');
    const [color3, setColor3] = useState('');
    const [color4, setColor4] = useState('');
    const [color5, setColor5] = useState('');
    const [usePercentage, setUsePercentage] = useState(false);
    const colorSetter = [setColor1, setColor2, setColor3, setColor4, setColor5];
    const [disabled, setDisabled] = useState(true);
    const [color, setColor] = useState('');
    const [result, setResult] = useState([]);
    useEffect(() => {
        async function main() {
            const [vision, text] = await Promise.all([
                FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"),
                TextFilesetResolver.forTextTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text/wasm"),
            ]);
            const [imageEmbedder, textEmbedder] = await Promise.all([
                ImageEmbedder.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite`
                    },
                }),
                TextEmbedder.createFromModelPath(text, "https://storage.googleapis.com/mediapipe-models/text_embedder/universal_sentence_encoder/float32/1/universal_sentence_encoder.tflite"),
            ]);
            setEmbedder(imageEmbedder);
            setTextEmbedder(textEmbedder);
            alert('모델 준비 완료');
            setDisabled(false);
        }
        main();
    }, []);
    const onStart = async () => {
        const response2 = await axios.get(`/api/collections/noImageEmbedding`);
        console.log(response2.data, embedder);
        for (const r of response2.data) {
            const htmlImageElement = document.querySelector('#image');
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
        const response2 = await axios.get(`/api/collections/allTextEmbedding`);
        console.log(response2.data, textEmbedder);
        const map = new Map();
        for (const r of response2.data) {
            const obj = map.get(r.imageId);
            if (obj) {
                obj.en.add(r.enTitle);
                obj.ko.add(r.koTitle);
            }
            else {
                map.set(r.imageId, {
                    en: new Set([r.enTitle]),
                    ko: new Set([r.koTitle]),
                    full: r.fullPrompt,
                });
            }
        }
        for (const m of map) {
            const textEmbedderResult = textEmbedder.embed(m[1].full + ' ' + Array.from(m[1].en).join(' ') + ' ' + Array.from(m[1].ko).join(' '));
            console.log(m, textEmbedderResult);
            await axios.patch(`/api/collections/${m[0]}/textEmbed`, {
                vector: JSON.stringify(textEmbedderResult.embeddings[0].floatEmbedding),
            });
        }
    };
    const convertToHex = (color) => {
        if (color < 0) {
            color = 0;
        }
        else if (color > 255) {
            color = 255;
        }
        ;
        const hex = color.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    const rgb2hex = (r, g, b) => ((convertToHex(r) + convertToHex(g) + convertToHex(b)).toUpperCase());
    const onColorStart = async () => {
        const response2 = await axios.get(`/api/collections/noColors`);
        console.log(response2.data);
        const filtered = response2.data.filter((v) => {
            if (color) {
                return v.imageId.toString() === color;
            }
            return true;
        });
        const image = document.querySelector('#image');
        for (const r of filtered) {
            await new Promise((resolve, reject) => {
                console.log(r);
                const loadEvent = async function () {
                    const palette = Palette.extract(image, {
                        maxSwatches: 5,
                        filters: [opacityFilter(0.5)]
                    });
                    const swatches = palette.findSwatches(5, 'vivid');
                    console.log(swatches);
                    for (const setter of colorSetter) {
                        setter('');
                    }
                    let i = 0;
                    let total = 0;
                    for (const rr of swatches) {
                        total += rr.population;
                    }
                    for (const rr of swatches) {
                        const lab = rr.color.toLAB();
                        const rgb = rr.color.toRGB();
                        const hex = '#' + rgb2hex(rgb.r, rgb.g, rgb.b);
                        colorSetter[i](hex);
                        console.log(r.imageId, lab, rgb, hex, rr.population, rr.name);
                        await axios.post(`/api/collections/${r.imageId}/colors`, {
                            lab: [lab.l, lab.a, lab.b],
                            rgb: hex,
                            name: rr.name,
                            percentage: rr.population / total,
                        });
                        i++;
                    }
                    image.removeEventListener('load', loadEvent);
                    resolve(result);
                };
                image.addEventListener('load', loadEvent);
                image.src = `/api/admin/images/${r.imageId}/binary`;
            });
        }
    };
    const onChange = (e) => {
        setValue(e.target.value || '');
    };
    const onChangeColor = (e) => {
        setColor(e.target.value);
    };
    const onClick = async () => {
        const response = await axios.get(`/api/collections/imageEmbedding`);
        const target = response.data.find((v) => v.imageId.toString() === value);
        const result = response.data.map((v) => {
            const similar = ImageEmbedder.cosineSimilarity({ floatEmbedding: JSON.parse(target.imageEmbedding), headName: 'feature', headIndex: 0 }, { floatEmbedding: JSON.parse(v.imageEmbedding), headName: 'feature', headIndex: 0 });
            return {
                imageId: v.imageId,
                similar: similar.toString(),
            };
        }).toSorted((a, b) => parseFloat(b.similar) - parseFloat(a.similar));
        console.log(result);
        setResult(result);
    };
    const onTextClick = async () => {
        const response = await axios.get(`/api/collections/textEmbedding`);
        const target = response.data.find((v) => v.imageId.toString() === value);
        if (!target.textEmbedding) {
            return;
        }
        const result = response.data.map((v) => {
            if (!v.textEmbedding) {
                return { imageId: v.imageId };
            }
            const similar = TextEmbedder.cosineSimilarity({ floatEmbedding: JSON.parse(target.textEmbedding), headName: 'feature', headIndex: 0 }, { floatEmbedding: JSON.parse(v.textEmbedding), headName: 'feature', headIndex: 0 });
            return {
                imageId: v.imageId,
                similar: similar.toString(),
            };
        }).toSorted((a, b) => parseFloat(b.similar) - parseFloat(a.similar));
        console.log(result);
        setResult(result);
    };
    const onColorClick = async () => {
        const rgb = color.split(',').map((v) => parseInt(v));
        const target = Color.fromRGB({ r: rgb[0], g: rgb[1], b: rgb[2] });
        const response = await axios.get(`/api/collections/allColors`);
        response.data.forEach((color) => {
            if (!color.color) {
                color.similar = Infinity;
                return;
            }
            const lab2 = color.color.split(',').map((v) => parseFloat(v.replace(/[()]/g, '')));
            const comparison = Color.fromLAB({ l: lab2[0], a: lab2[1], b: lab2[2] });
            color.similar = target.differenceTo(comparison);
        });
        const uniq = (arr, track = new Set()) => arr.filter(({ imageId }) => (track.has(imageId) ? false : track.add(imageId)));
        const sorted = response.data.toSorted((a, b) => {
            if (usePercentage) {
                return a.similar / a.percentage - b.similar / b.percentage;
            }
            return a.similar - b.similar;
        });
        const unique = uniq(sorted);
        console.log(unique);
        setResult(unique);
    };
    return (React.createElement("div", null,
        React.createElement("img", { id: 'image', alt: '', width: 256, height: 256 }),
        React.createElement("br", null),
        React.createElement("input", { type: "color", id: "color1", name: "head", value: color1 }),
        React.createElement("input", { type: "color", id: "color2", name: "head", value: color2 }),
        React.createElement("input", { type: "color", id: "color3", name: "head", value: color3 }),
        React.createElement("input", { type: "color", id: "color4", name: "head", value: color4 }),
        React.createElement("input", { type: "color", id: "color5", name: "head", value: color5 }),
        React.createElement("br", null),
        React.createElement("button", { onClick: onStart, disabled: disabled }, "\uC804\uCCB4 \uC774\uBBF8\uC9C0 \uC784\uBCA0\uB529 \uC2DC\uC791"),
        React.createElement("button", { onClick: onTextStart, disabled: disabled }, "\uC804\uCCB4 \uD14D\uC2A4\uD2B8 \uC784\uBCA0\uB529 \uC2DC\uC791"),
        React.createElement("button", { onClick: onColorStart }, "\uC804\uCCB4 \uCEEC\uB7EC \uD314\uB808\uD2B8 \uC2DC\uC791"),
        React.createElement("br", null),
        React.createElement("input", { value: value, onChange: onChange }),
        React.createElement("button", { onClick: onClick, disabled: disabled }, "\uC774\uBBF8\uC9C0 \uC720\uC0AC\uB3C4 \uC870\uD68C"),
        React.createElement("button", { onClick: onTextClick, disabled: disabled }, "\uD14D\uC2A4\uD2B8 \uC720\uC0AC\uB3C4 \uC870\uD68C"),
        React.createElement("br", null),
        React.createElement("input", { value: color, onChange: onChangeColor }),
        React.createElement("button", { onClick: onColorClick }, "\uCEEC\uB7EC \uC720\uC0AC\uB3C4 \uC870\uD68C"),
        React.createElement("label", { htmlFor: "" },
            "\uD37C\uC13C\uD2F0\uC9C0 \uBC18\uC601",
            React.createElement("input", { type: "checkbox", checked: usePercentage, onChange: (e) => setUsePercentage(e.target.checked) })),
        React.createElement("div", null, result.slice(0, 20).map((v) => (React.createElement("div", null,
            React.createElement("img", { src: `/api/admin/images/${v.imageId}/thumb`, alt: "", width: 128, height: 128 }),
            React.createElement("div", null,
                v.imageId,
                " ",
                v.similar)))))));
};
export default ImageEmbed;
//# sourceMappingURL=ImageEmbed.js.map