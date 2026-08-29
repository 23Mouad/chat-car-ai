const text = `ممتاز، Mouad! فيراري 488 GTB ممتعة للطرق والحلبات. كم عمرك لتخصيص النصيحة؟

<!--profile:{"name":"mouad"}>-->`;

console.log("Original:");
console.log(text);
console.log("Replaced:");
console.log(text.replace(/<!--profile:[\s\S]*$/i, ""));
