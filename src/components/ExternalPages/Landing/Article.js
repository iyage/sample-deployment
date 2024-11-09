import LandingFooter from "components/ExternalPages/Landing/components/LandingFooter";
// import { BackArrowIcon } from "assets/arts";
import { Link, useParams } from "react-router-dom";
import LandingNav from "./components/LandingNav";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { blogActions } from "actions/blogActions";
import moment from "moment";
import Skeleton from "components/common/Skeleton";
import { sanitizeHtml } from "helpers/sanitizeHtml";
import CookiePrompt from "./components/CookiePrompt";

const Article = () => {
    const [article, setArticle] = useState();
    const [relatedArticle, setRelatedArticle] = useState();
    const [activeTableItem, setActiveTableItem] = useState(null);
    const { articleId, cat } = useParams();
    const dispatch = useDispatch();
    const {
        fetchingSingleArticle,
        fetchedSingleArticleSuccess,
        fetchingArticlesByTag,
        fetchedArticlesByTagSuccess,
    } = useSelector((state) => state.blog);

    const moreLikeThisArticles = relatedArticle?.filter((value) => value?.id !== article?.id);

    const { sanitizedHTML, toc } = sanitizeHtml(article?.html);

    useEffect(() => {
        if (articleId) {
            dispatch(blogActions.fetchSingleArticle(articleId));
        }
    }, [dispatch, articleId]);

    useEffect(() => {
        if (cat) {
            dispatch(blogActions.fetchArticlesByTag(cat, 1, 5));
        }
    }, [dispatch, cat]);

    useEffect(() => {
        if (fetchedSingleArticleSuccess) {
            setArticle(fetchedSingleArticleSuccess);
        }
    }, [fetchedSingleArticleSuccess]);

    useEffect(() => {
        if (fetchedArticlesByTagSuccess) {
            setRelatedArticle(fetchedArticlesByTagSuccess?.posts);
        }
    }, [fetchedArticlesByTagSuccess]);

    return (
        <div className="bg-landing-black">
            <LandingNav />
            <header className="[&_*]:text-white max-lg:px-6 px-[115px] pt-[160px] max-lg:pb-[41px] pb-[82px]">
                <Link
                    to={"/blog"}
                    className="flex items-center text-[13px] max-sm:text-[10px] font-rocGroteskMedium"
                >
                    {/* <BackArrowIcon className="h-[12px] w-[12px] mr-1" />  */}
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687265355/Web%20App/website/icons/back-arrow_wexbzb.svg"
                        }
                        alt="back arrow icon"
                        className="h-[12px] w-[12px] mr-1"
                    />{" "}
                    Back
                </Link>
                {fetchingSingleArticle ? (
                    <Skeleton className={"w-[100px] h-6 !bg-mvx-neutral mt-2"} />
                ) : (
                    <h2 className="font-rocGroteskMedium text-xl max-sm:text-sm mt-2">
                        {article?.primary_tag?.name}
                    </h2>
                )}

                {fetchingSingleArticle ? (
                    <Skeleton className={"w-[300px] h-10 !bg-mvx-neutral mt-9"} />
                ) : (
                    <h1 className="font-rocGroteskMedium text-[40px] max-sm:text-xl leading-[57.6px] mt-9">
                        {article?.title}
                    </h1>
                )}

                {fetchingSingleArticle ? (
                    <div className="flex items-center gap-10 mt-5">
                        <Skeleton className={"w-[250px] h-3 !bg-mvx-neutral"} />
                        <Skeleton className={"w-[80px] h-3 !bg-mvx-neutral"} />
                    </div>
                ) : (
                    <p className="flex text-[15px] mt-5">
                        <span className="mr-10">
                            By:{" "}
                            <span className="font-rocGroteskMedium">
                                {article?.primary_author?.name}
                            </span>{" "}
                            <span className="font-rocGroteskBold">&nbsp; | &nbsp;</span>{" "}
                            {moment(article?.published_at).format("MMM Do, YYYY")}
                        </span>{" "}
                        {article?.reading_time} mins read
                    </p>
                )}

                <div className="mt-7">
                    {fetchingSingleArticle ? (
                        <Skeleton
                            className={"w-full h-[463px] !bg-mvx-neutral !rounded-xl relative z-10"}
                        />
                    ) : (
                        <img
                            src={article?.feature_image}
                            alt="subscribe to news letter"
                            className="h-[463px] rounded-xl  object-cover w-full relative z-10"
                        />
                    )}

                    <p className="rounded-lg bg-gun-metal text-white w-[43%] ml-auto -translate-y-2.5 text-right pt-4 pb-1 px-3">
                        LATEST ARTICLE
                    </p>
                </div>
            </header>

            <div>
                <div className="relative flex justify-between max-lg:px-6 px-[115px] pb-[115px] [&_*]:text-white">
                    <aside className="max-lg:hidden w-[20%] sticky top-0 h-fit">
                        <h4 className="font-rocGroteskBold">ON THIS PAGE</h4>
                        {fetchingSingleArticle ? (
                            <>
                                <Skeleton className={"w-[150px] h-3 !bg-mvx-neutral mt-4"} />
                                <Skeleton className={"w-[150px] h-3 !bg-mvx-neutral mt-3"} />
                                <Skeleton className={"w-[150px] h-3 !bg-mvx-neutral mt-3"} />
                            </>
                        ) : (
                            <>
                                <ul>
                                    {toc.map((entry, index) => (
                                        <li
                                            className="text-sm mt-4 mb-3"
                                            key={entry.id}
                                            onClick={() => setActiveTableItem(index)}
                                        >
                                            <a
                                                href={`#${entry.id}`}
                                                className={`block ${
                                                    activeTableItem === index &&
                                                    "font-rocGroteskBold"
                                                }`}
                                            >
                                                {entry.content.replace(/<[^>]+>/g, "")}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <div className="flex items-center -translate-x-3 [&>*:not(first-of-type)]:ml-3 mt-6">
                            <a
                                href="https://twitter.com/TradeAlly_io"
                                target={"_blank"}
                                rel="noreferrer"
                            >
                                {/* <TwitterIcon className="h-[20px] w-[20px]" /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261897/Web%20App/Twitter_sixlxb.svg"
                                    }
                                    alt="Twitter Icon"
                                    className="h-[20px] w-[20px]"
                                />
                            </a>
                            <a
                                href="https://facebook.com/TradeAlly"
                                target={"_blank"}
                                rel="noreferrer"
                            >
                                {/* <FacebookIcon className="h-[20px] w-[20px]" /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261442/Web%20App/Facebook_kybnjz.svg"
                                    }
                                    alt="Facebook Icon"
                                    className="h-[20px] w-[20px]"
                                />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/tradeallyio/"
                                target={"_blank"}
                                rel="noreferrer"
                            >
                                {/* <LinkedInIcon className="h-[20px] w-[20px]" /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261771/Web%20App/LinkedIn_w7ug35.svg"
                                    }
                                    alt="LinkedIn Icon"
                                    className="h-[20px] w-[20px]"
                                />
                            </a>
                            <a
                                href="https://www.instagram.com/tradeally_io/"
                                target={"_blank"}
                                rel="noreferrer"
                            >
                                {/* <InstagramIcon className="h-[20px] w-[20px]" /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261586/Web%20App/Instagram_sx2yaz.svg"
                                    }
                                    alt="Instagram Icon"
                                    className="h-[20px] w-[20px]"
                                />
                            </a>
                        </div>
                    </aside>
                    <article className="w-[70%] max-lg:w-full">
                        {fetchingSingleArticle ? (
                            [...Array(20).keys()]?.map((_, idx) => (
                                <Skeleton key={idx} className={"w-full h-3 !bg-mvx-neutral mb-4"} />
                            ))
                        ) : (
                            <div
                                id="article-content"
                                className="leading-[29px]"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizedHTML?.join(""),
                                }}
                            ></div>
                        )}
                    </article>
                </div>
            </div>

            <section className="bg-gun-metal px-3 400:px-4 sm:px-16 1100:px-[115px] pt-[72px] pb-[82px]">
                <h3 className="text-center text-white text-lg">MORE STORIES LIKE THIS</h3>

                {fetchingArticlesByTag ? (
                    <div className="grid grid-cols-2 gap-x-[21px] mt-14">
                        <div className="bg-[#253858] rounded-[15px]">
                            <Skeleton
                                className={"h-[275px] w-full !rounded-[15px] !bg-mvx-neutral"}
                            />
                            <div className="px-[22px] pt-6 pb-10 [&_*]:text-white">
                                <Skeleton className={"w-[60%] h-4 !bg-mvx-neutral mb-3"} />
                                <Skeleton className={"w-[60%] h-4 !bg-mvx-neutral"} />

                                <div className="flex justify-between items-center mt-4">
                                    <Skeleton className={"w-[40%] h-3 !bg-mvx-neutral"} />
                                    <Skeleton className={"w-[13%] h-3 !bg-mvx-neutral"} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#253858] rounded-[15px]">
                            <Skeleton
                                className={"h-[275px] w-full !rounded-[15px] !bg-mvx-neutral"}
                            />
                            <div className="px-[22px] pt-6 pb-10 [&_*]:text-white">
                                <Skeleton className={"w-[60%] h-4 !bg-mvx-neutral mb-3"} />
                                <Skeleton className={"w-[60%] h-4 !bg-mvx-neutral"} />

                                <div className="flex justify-between items-center mt-4">
                                    <Skeleton className={"w-[40%] h-3 !bg-mvx-neutral"} />
                                    <Skeleton className={"w-[13%] h-3 !bg-mvx-neutral"} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {moreLikeThisArticles && moreLikeThisArticles?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-[20px] max-lg:grid-cols-1 mt-14">
                                {moreLikeThisArticles?.slice(0, 2)?.map((value, idx) => (
                                    <div
                                        key={value?.title + idx}
                                        className="bg-[#253858] rounded-[15px]"
                                    >
                                        <img
                                            src={value?.feature_image}
                                            alt={value?.title}
                                            className="rounded-[15px] w-full h-[275px]"
                                        />
                                        <div className="px-[22px] pt-6 pb-10 [&_*]:text-white">
                                            <p className="w-[60%] font-rocGroteskMedium text-lg">
                                                {value?.title}
                                            </p>
                                            <p className="flex justify-between text-[13px] mt-4">
                                                <span>
                                                    By:{" "}
                                                    <span className="font-rocGroteskMedium">
                                                        {value?.primary_author?.name}
                                                    </span>{" "}
                                                    <span className="font-rocGroteskBold">
                                                        &nbsp; | &nbsp;
                                                    </span>{" "}
                                                    {moment(value?.published_at).format(
                                                        "MMM Do, YYYY"
                                                    )}
                                                </span>{" "}
                                                {value?.reading_time} min read
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center w-full mt-14">
                                <p className="text-lg font-rocGroteskMedium text-center text-white">
                                    No Related Articles
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            <section className="max-lg:px-6 px-[100px] py-20">
                <div className="rounded-[15px] h-[554px] overflow-hidden relative">
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687179951/Web%20App/website/subscribe-article_fmlsrq.jpg"
                        }
                        alt="subscribe to news letter"
                        className="h-full object-cover w-full"
                    />

                    <div className="absolute bg-white rounded-md px-[22px] pt-7 pb-16 bottom-8 left-8 w-[51%] max-sm:w-[95%] max-sm:left-[10px]">
                        <h3 className="font-rocGroteskBold text-2xl leading-[34.56px]">
                            Get all the juiciest trade and commerce updates at your fingertips
                        </h3>
                        <p className="text-sm font-rocGrotesk text-mvx-neutral mt-3.5 mb-7">
                            Subscribe to Fleet+’s weekly newsletter for the latest tips, news, and
                            stories within the global freight forwarding sector
                        </p>
                        <form
                            className="w-[70%] grid grid-cols-[80%,1fr] items-center"
                            onClick={(evt) => evt.preventDefault()}
                        >
                            <input
                                className={`border text-sm font-rocGroteskMedium px-3 border-[#DFE1E6] border-r-0 text-[#6B778C] rounded-l py-[9.3px] bg-inherit translate-y-[.2px] placeholder:text-[11px] placeholder:font-rocGroteskMedium placeholder:text-[#6B778C]`}
                                placeholder="Enter your email address"
                                type="email"
                            />
                            <button
                                type="submit"
                                className="bg-pacific-cyan font-rocGroteskMedium py-[10.2px] text-white rounded-l-none rounded-r text-sm"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <LandingFooter />
            <CookiePrompt />
        </div>
    );
};

export default Article;
