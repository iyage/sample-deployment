import config from "config/config";
import { authService } from "./authService";

export const blogService = {
    getArticlesByTag,
    getSingleArticle,
    getBlogTags,
};

async function getArticlesByTag(category = "all", page = "1", limit = 10, date) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${
            config.API_URL
        }/api/v1/website/blog/filter?blogTag=${category}&page=${page}&limit=${limit}${
            Boolean(date) ? "&blogDate=" + date : ""
        }`,
        requestOptions
    );

    return res;
}

async function getSingleArticle(articleId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/website/blog/single?blogId=${articleId}`,
        requestOptions
    );

    return res;
}

async function getBlogTags() {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/website/blog/tags`,
        requestOptions
    );

    return res;
}
