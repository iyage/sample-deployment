import { blogConstants } from "constants";
import { blogService } from "services/blogService";

export const blogActions = {
    fetchArticlesByTag,
    fetchSingleArticle,
    fetchBlogTags,
};

function fetchArticlesByTag(category, page, limit, date) {
    return (dispatch) => {
        dispatch(request(blogConstants.FETCH_ARTICLES_BY_TAG_REQUEST));
        blogService.getArticlesByTag(category, page, limit, date).then(
            (res) => {
                dispatch(success(blogConstants.FETCH_ARTICLES_BY_TAG_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(blogConstants.FETCH_ARTICLES_BY_TAG_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchSingleArticle(articleId) {
    return (dispatch) => {
        dispatch(request(blogConstants.FETCH_SINGLE_ARTICLE_REQUEST));
        blogService.getSingleArticle(articleId).then(
            (res) => {
                dispatch(success(blogConstants.FETCH_SINGLE_ARTICLE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(blogConstants.FETCH_SINGLE_ARTICLE_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchBlogTags() {
    return (dispatch) => {
        dispatch(request(blogConstants.FETCH_BLOG_TAGS_REQUEST));
        blogService.getBlogTags().then(
            (res) => {
                dispatch(success(blogConstants.FETCH_BLOG_TAGS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(blogConstants.FETCH_BLOG_TAGS_FAILURE, error.message));
                }
            }
        );
    };
}

function request(type) {
    return { type: type };
}
function success(type, data) {
    return { type: type, payload: data };
}
function failure(type, error) {
    return { type: type, payload: error ?? "" };
}
