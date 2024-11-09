export const sanitizeHtml = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"];

    const toc = [];

    const updatedHTML = Array.from(doc.body.childNodes).map((node) => {
        if (headingTags.includes(node.nodeName.toLowerCase())) {
            const tagIndex = Number(node.nodeName.charAt(1)) - 1;
            const fontSize = `${2.25 - tagIndex * 0.25}rem`;
            const fontWeight = tagIndex < 2 ? "bold" : "normal";
            const lineHeight = 1.2 + tagIndex * 0.1;
            const marginTop = `${tagIndex * 0.5}rem`;
            const marginBottom = `${tagIndex * 0.5}rem`;
            const style = `font-size: ${fontSize}; font-weight: ${fontWeight}; line-height: ${lineHeight}; margin-top: ${marginTop}; margin-bottom: ${marginBottom}`;

            const content = node.innerHTML;
            const headingId = `heading-${toc.length + 1}`;
            const tocEntry = { id: headingId, content };
            toc.push(tocEntry);

            return `<${node.nodeName} id="${headingId}" style="${style}">${content}</${node.nodeName}>`;
        }

        if (node.nodeName.toLowerCase() === "img" || node.nodeName.toLowerCase() === "figure") {
            return `<div style="display: flex; justify-content: center; margin-top: 1rem; margin-bottom: 1rem;">${node.outerHTML}</div>`;
        }

        if (node.nodeName.toLowerCase() === "a") {
            node.setAttribute("style", "color: blue; text-decoration: underline;");
        }

        if (node.nodeName.toLowerCase() === "div") {
            const classNames = node.className.split(" ");

            classNames.forEach((className) => {
                if (className.includes("button")) {
                    node.setAttribute(
                        "style",
                        "background-color: #16C6A4; color: white; font-size: 15px; padding: 6px 20px; border-radius: 6px; margin: 10px auto; width: fit-content;"
                    );
                }
            });
        }
        if (node.nodeName.toLowerCase() === "p") {
            node.setAttribute("style", "margin: 10px 0");
        }

        if (node.nodeName.toLowerCase() === "ol") {
            node.setAttribute(
                "style",
                "display: block; list-style-type: decimal; margin-block-start: 1em; margin-block-end: 1em; margin-inline-start: 0px; margin-inline-end: 0px; padding-inline-start: 40px;"
            );
        }

        if (node.nodeName.toLowerCase() === "ul") {
            node.setAttribute(
                "style",
                "display: block; list-style-type: disc; margin-block-start: 1em; margin-block-end: 1em; margin-inline-start: 0px; margin-inline-end: 0px; padding-inline-start: 40px;"
            );
        }

        return node.outerHTML;
    });

    return { sanitizedHTML: updatedHTML, toc };
};

export const hasHTMLTag = (str) => {
    // Regular expression to match any HTML tag in the string
    const htmlTagRegex = /<([a-z][a-z0-9]*)\b[^>]*>/gi;

    return htmlTagRegex.test(str);
};
