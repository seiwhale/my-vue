// 标签属性
export const attributeRegExp = /^\s*([^\s"'<>\\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>]+)))?/;

export const ncname = "[a-zA-Z_][\\w\\-\\.]*";

export const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

// 开始标签开始
export const startTagOpenRegExp = new RegExp(`^<${qnameCapture}`);

// 开始标签结束
export const startTagCloseRegExp = /^\s*(\/?)>/;

// 结束标签
export const endTagRegExp = new RegExp(`^<\/${qnameCapture}[^>]*>`);

// 注释
export const commentRegExp = /^<!--/;