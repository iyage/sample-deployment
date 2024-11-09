import { blogConstants } from "constants";

const initialState = {
    fetchingArticlesByTag: false,
    fetchedArticlesByTagSuccess: null,
    fetchedArticlesByTagError: "",
    fetchingSingleArticle: false,
    fetchedSingleArticleSuccess: null,
    fetchedSingleArticleError: "",
    fetchingBlogTags: false,
    fetchedBlogTagsSuccess: null,
    fetchedBlogTagsError: "",
};

export function blog(state = initialState, action) {
    switch (action.type) {
        case blogConstants.FETCH_ARTICLES_BY_TAG_REQUEST:
            return {
                ...state,
                fetchingArticlesByTag: true,
                fetchedArticlesByTagSuccess: null,
                fetchedArticlesByTagError: "",
            };
        case blogConstants.FETCH_ARTICLES_BY_TAG_SUCCESS:
            return {
                ...state,
                fetchingArticlesByTag: false,
                fetchedArticlesByTagSuccess: action.payload,
                fetchedArticlesByTagError: "",
            };
        case blogConstants.FETCH_ARTICLES_BY_TAG_FAILURE:
            return {
                ...state,
                fetchingArticlesByTag: false,
                fetchedArticlesByTagSuccess: null,
                fetchedArticlesByTagError: action.payload,
            };

        case blogConstants.FETCH_SINGLE_ARTICLE_REQUEST:
            return {
                ...state,
                fetchingSingleArticle: true,
                fetchedSingleArticleSuccess: null,
                fetchedSingleArticleError: "",
            };
        case blogConstants.FETCH_SINGLE_ARTICLE_SUCCESS:
            return {
                ...state,
                fetchingSingleArticle: false,
                fetchedSingleArticleSuccess: action.payload,
                fetchedSingleArticleError: "",
            };
        case blogConstants.FETCH_SINGLE_ARTICLE_FAILURE:
            return {
                ...state,
                fetchingSingleArticle: false,
                fetchedSingleArticleSuccess: null,
                fetchedSingleArticleError: action.payload,
            };

        case blogConstants.FETCH_BLOG_TAGS_REQUEST:
            return {
                ...state,
                fetchingBlogTags: true,
                fetchedBlogTagsSuccess: null,
                fetchedBlogTagsError: "",
            };
        case blogConstants.FETCH_BLOG_TAGS_SUCCESS:
            return {
                ...state,
                fetchingBlogTags: false,
                fetchedBlogTagsSuccess: action.payload,
                fetchedBlogTagsError: "",
            };
        case blogConstants.FETCH_BLOG_TAGS_FAILURE:
            return {
                ...state,
                fetchingBlogTags: false,
                fetchedBlogTagsSuccess: null,
                fetchedBlogTagsError: action.payload,
            };

        default:
            return state;
    }
}
