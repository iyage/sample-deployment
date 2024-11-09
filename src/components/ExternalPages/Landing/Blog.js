import LandingFooter from "./components/LandingFooter";
import LandingNav from "./components/LandingNav";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { blogActions } from "actions/blogActions";
import moment from "moment";
import { Link } from "react-router-dom";
import Skeleton from "components/common/Skeleton";
import ReactPaginate from "react-paginate";
import SelectInput from "components/common/SelectInput";
import { truncate } from "lodash";
import { websiteService } from "services";
import Loader from "components/common/Loader";
import CookiePrompt from "./components/CookiePrompt";

const Blog = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [dateFilter, setDateFilter] = useState(null);
    const [numOfPages, setNumOfPages] = useState(null);
    const [allArticles, setAllArticles] = useState([]);
    const [blogTags, setBlogTags] = useState([]);
    const [email, setEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);
    const emailRegex = /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+$/;

    const dispatch = useDispatch();
    const {
        fetchingArticlesByTag,
        fetchedArticlesByTagSuccess,
        fetchingBlogTags,
        fetchedBlogTagsSuccess,
    } = useSelector((state) => state.blog);

    const dropDownTags = blogTags?.map((tag) => {
        return {
            label: tag?.name?.toUpperCase(),
            value: tag?.slug,
        };
    });

    const allDropDownTags = [
        {
            label: "ALL",
            value: "all",
        },
        ...dropDownTags,
    ];

    useEffect(() => {
        dispatch(
            blogActions.fetchArticlesByTag(
                activeCategory,
                currentPage,
                9,
                dateFilter ? moment().subtract(dateFilter, "days").format("YYYY-MM-DD") : null
            )
        );
    }, [dispatch, activeCategory, currentPage, dateFilter]);

    useEffect(() => {
        dispatch(blogActions.fetchBlogTags());
    }, [dispatch]);

    useEffect(() => {
        if (fetchedArticlesByTagSuccess) {
            setNumOfPages(fetchedArticlesByTagSuccess?.pagination?.pages);
            setAllArticles(fetchedArticlesByTagSuccess?.posts);
        }
    }, [fetchedArticlesByTagSuccess]);

    useEffect(() => {
        if (fetchedBlogTagsSuccess) {
            setBlogTags(fetchedBlogTagsSuccess);
        }
    }, [fetchedBlogTagsSuccess]);

    return (
        <div className="bg-landing-black [&_*]:text-white">
            <LandingNav />
            <header className="max-lg:px-6 py pt-[190px] pb-[82px] text-center [&_*]:text-white">
                <h1 className="font-rocGroteskBold text-7xl max-sm:text-[32px]">
                    The Northstar by Fleet+
                </h1>
                <p className="text-xl leading-[29px] mt-7 max-sm:mt-5 mb-6 max-sm:text-sm  max-sm:leading-[29px]">
                    Our team of experts write The NorthStar to provide you with news, insights, and
                    analysis on <br className="max-lg:hidden" /> freight and trade. With The
                    NorthStar, you can better navigate international trade and grow{" "}
                    <br className="max-lg:hidden" /> your business.
                </p>
                <div className="w-[35%] max-lg:w-[70%] max-sm:w-full grid grid-cols-[70%,1fr] max-sm:flex max-sm:flex-col max-sm:gap-[14px] items-center mx-auto">
                    <input
                        className={`border text-sm font-rocGroteskMedium px-3 h-[48px] border-[#DFE1E6] border-r-0 text-[#6B778C] max-sm:!border max-sm:!rounded max-sm:w-full rounded-l py-[14px] bg-inherit translate-y-[.2px] placeholder:text-[11px] placeholder:font-rocGroteskMedium placeholder:text-[#6B778C]`}
                        placeholder="Enter your email address"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <button
                        type="button"
                        className="bg-pacific-cyan font-rocGroteskMedium h-[48px] py-[13px] !text-gun-metal rounded-l-none rounded-r max-sm:!rounded max-sm:w-full"
                        disabled={!email.match(emailRegex)}
                        onClick={() => {
                            websiteService.subscribeToNewsletter(
                                { email },
                                setEmail,
                                setSubscribing
                            );
                        }}
                    >
                        {subscribing ? <Loader size={4} color="white" /> : "Subscribe"}
                    </button>
                </div>
            </header>

            <div className="relative">
                <section
                    className={`bg-gun-metal max-lg:px-6 px-[100px] transition-all duration-1000 py-7 flex justify-between sticky top-0 z-[1001]`}
                >
                    <div className="flex items-center w-[80%] max-lg:hidden overflow-auto scrollbar-hide [&>*:not(first-of-type)]:ml-7">
                        <p
                            onClick={() => {
                                setActiveCategory("all");
                                setCurrentPage(1);
                            }}
                            className={`${
                                activeCategory === "all" &&
                                "font-rocGroteskBold text-xl border-x-0 border-t-0 border-b-[3px] border-white px-1"
                            } cursor-pointer uppercase`}
                        >
                            ALL
                        </p>
                        {fetchingBlogTags ? (
                            <div className="flex items-center gap-7">
                                <Skeleton className={"w-[49px] h-4 !bg-mvx-neutral"} />
                                <Skeleton className={"w-[49px] h-4 !bg-mvx-neutral"} />
                            </div>
                        ) : (
                            blogTags?.map((tag) => {
                                return (
                                    <p
                                        key={tag?.id}
                                        onClick={() => {
                                            setActiveCategory(tag?.slug);
                                            setCurrentPage(1);
                                        }}
                                        className={`${
                                            activeCategory === tag?.slug &&
                                            "font-rocGroteskBold text-xl border-x-0 border-t-0 border-b-[3px] border-white px-1"
                                        } cursor-pointer uppercase`}
                                    >
                                        {tag?.name}
                                    </p>
                                );
                            })
                        )}
                    </div>
                    <div className="hidden max-lg:block max-sm:w-full">
                        <SelectInput
                            value={activeCategory}
                            name="dateFilter"
                            placeholder={"Category"}
                            handleChange={(_, value) => {
                                setActiveCategory(value);
                                setCurrentPage(1);
                            }}
                            isRequired={true}
                            className="bg-transparent border !w-full !border-[#DFE1E6] rounded "
                            dropdownClassName="!bg-gun-metal shadow-dropdownShadow border !border-[#DFE1E6] rounded"
                            optionItemContainerClassName="hover:bg-mvx-neutral/50"
                            activeOptionItemContainerClassName="bg-mvx-neutral/50"
                            optionItemClassName="text-xs"
                            activeOptionItemClassName="!text-sm"
                            dropdownOptions={allDropDownTags}
                        />
                    </div>

                    <div className="flex justify-end max-sm:hidden">
                        <SelectInput
                            value={dateFilter}
                            name="dateFilter"
                            placeholder={"Filter"}
                            handleChange={(_, value) => setDateFilter(value)}
                            isRequired={true}
                            className="bg-transparent border !w-[130px] !border-[#DFE1E6] rounded "
                            dropdownClassName="!bg-gun-metal shadow-dropdownShadow border !border-[#DFE1E6] rounded"
                            optionItemContainerClassName="hover:bg-mvx-neutral/50"
                            activeOptionItemContainerClassName="bg-mvx-neutral/50"
                            optionItemClassName="text-xs"
                            activeOptionItemClassName="!text-sm"
                            dropdownOptions={[
                                {
                                    label: "Last 7 days",
                                    value: 7,
                                },
                                {
                                    label: "Last 1 month",
                                    value: 30,
                                },
                                {
                                    label: "Last 1 year",
                                    value: 365,
                                },
                            ]}
                        />
                    </div>
                </section>

                {fetchingArticlesByTag ? (
                    <section className="px-3 max-lg:px-6 px-[100px] pt-16 overflow-y-hidden grid grid-cols-[45%,49%] max-lg:flex max-lg:flex-col-reverse justify-between ">
                        <div>
                            <Skeleton className={"w-[300px] h-8 !bg-mvx-neutral mb-6"} />
                            <Skeleton className={"w-[550px] h-3 !bg-mvx-neutral mb-3"} />
                            <Skeleton className={"w-[550px] h-3 !bg-mvx-neutral mb-3"} />
                            <Skeleton className={"w-[550px] h-3 !bg-mvx-neutral mb-3"} />
                            <Skeleton className={"w-[550px] h-3 !bg-mvx-neutral mb-3"} />
                            <Skeleton className={"w-[550px] h-3 !bg-mvx-neutral mb-3"} />
                            <Skeleton className={"w-[550px] h-3 !bg-mvx-neutral mb-3"} />
                            <Skeleton className={"w-[300px] h-3 !bg-mvx-neutral mb-3"} />
                            <Skeleton className={"w-[250px] h-3 !bg-mvx-neutral mt-5 mb-3"} />
                        </div>
                        <div>
                            <Skeleton
                                className={
                                    "w-[600px] max-lg:w-full h-[408px] !bg-mvx-neutral relative z-10 !rounded-xl "
                                }
                            />
                            <div className="rounded-lg bg-gun-metal text-[15px] text-white w-[73%] ml-auto -translate-y-[160px] text-right pt-4 pb-2 px-3">
                                <div className="bg-pacific-cyan h-[142px] w-[2px] ml-auto mb-1.5" />
                                LATEST ARTICLE
                            </div>
                        </div>
                    </section>
                ) : allArticles && allArticles?.length > 0 ? (
                    <section className="px-3 max-lg:px-6 px-[100px] pt-16  overflow-y-hidden grid grid-cols-[45%,49%] justify-between max-lg:flex max-lg:flex-col-reverse ">
                        <div>
                            <h4 className="text-4xl max-lg:text-xl font-rocGroteskMedium leading-[52px]">
                                {allArticles?.[0]?.title}
                            </h4>
                            <p className="leading-[29px] text-sm mt-2.5">
                                {allArticles?.[0]?.excerpt}...
                                <Link
                                    to={`/blog/${allArticles?.[0]?.primary_tag?.name}/${allArticles?.[0]?.id}`}
                                    className="font-rocGroteskBold cursor-pointer"
                                >
                                    Read more
                                </Link>
                            </p>
                            <p className="flex justify-between text-[13px] mt-5">
                                <span>
                                    By:{" "}
                                    <span className="font-rocGroteskMedium">
                                        {allArticles?.[0]?.primary_author?.name}
                                    </span>{" "}
                                    <span className="font-rocGroteskBold">&nbsp; | &nbsp;</span>{" "}
                                    {moment(allArticles?.[0]?.published_at).format("MMM Do, YYYY")}
                                </span>{" "}
                                {allArticles?.[0]?.reading_time} min read
                            </p>
                        </div>
                        <div>
                            <div>
                                <Link
                                    to={`/blog/${allArticles?.[0]?.primary_tag?.name}/${allArticles?.[0]?.id}`}
                                >
                                    <img
                                        src={allArticles?.[0]?.feature_image}
                                        alt="subscribe to news letter"
                                        className="h-[408px] max-lg:h-auto max-lg:w-full rounded-xl object-cover w-full relative z-10 max-lg:mb-8"
                                    />
                                </Link>
                                <div className="max-lg:hidden rounded-lg bg-gun-metal text-[15px] text-white w-[73%] ml-auto mr-[-24px] -translate-y-[160px] text-right pt-4 pb-2 px-3">
                                    <div className="bg-pacific-cyan h-[142px] w-[2px] ml-auto mb-1.5" />
                                    LATEST ARTICLE
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className="flex justify-center w-full pt-10">
                        <p className="text-2xl font-rocGroteskBold">No Articles Available</p>
                    </div>
                )}

                <section className="max-lg:px-6 px-[100px] grid grid-cols-3 max-lg:grid-cols-1 gap-x-24 gap-y-20 py-20">
                    {fetchingArticlesByTag
                        ? [...Array(9).keys()]?.map((_, idx) => <ArticlesLoading key={idx} />)
                        : allArticles
                              ?.slice(1)
                              ?.map((article) => (
                                  <Article
                                      key={article?.uuid}
                                      title={article?.title}
                                      author={article?.primary_author?.name}
                                      content={article?.excerpt}
                                      catgory={article?.primary_tag?.name}
                                      duration={article?.reading_time + " mins read"}
                                      date={moment(article?.published_at).format("MMM Do, YYYY")}
                                      img={article?.feature_image}
                                      id={article?.id}
                                  />
                              ))}
                </section>

                {allArticles && allArticles?.slice(1) && allArticles?.slice(1)?.length > 0 && (
                    <div className="mt-4 flex w-full justify-center relative">
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel={
                                <div
                                    className={`w-8 h-8 rounded-full bg-[#EFEFEF] ${
                                        currentPage === numOfPages && "!bg-[#142837]"
                                    } flex items-center justify-center absolute top-0 right-[47.5%] max-lg:right-[45.5%] max-sm:right-[41%]`}
                                >
                                    <i className="ri-arrow-right-line text-lg before:content-['\ea6c'] before:text-black"></i>
                                </div>
                            }
                            onPageChange={(e) => setCurrentPage(e?.selected + 1)}
                            pageRangeDisplayed={4}
                            pageCount={numOfPages}
                            previousLabel={
                                <div
                                    className={`w-8 h-8 rounded-full bg-[#EFEFEF] ${
                                        currentPage === 1 && "!bg-[#142837]"
                                    } flex items-center justify-center absolute top-0 left-[47.4%] max-lg:left-[45.8%] max-sm:left-[42%]`}
                                >
                                    <i className="ri-arrow-left-line text-lg before:content-['\ea60'] before:text-black"></i>
                                </div>
                            }
                            className="flex items-center number-pagination mt-12 border rounded"
                            pageClassName="border-l [&:nth-child(2)]:border-l-0  border-[#D8D8D8] px-2.5 py-[5px]"
                            activeClassName={`bg-[#736CED] ${
                                currentPage === 1 && "rounded-tl rounded-bl"
                            } ${currentPage === numOfPages && "rounded-tr rounded-br"}`}
                            activeLinkClassName="!text-black"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                )}
            </div>

            <section className="max-lg:px-6 max-sm:px-0 px-[100px] py-20">
                <div className="rounded-[15px] max-sm:rounded-none h-[554px] overflow-hidden relative">
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687179951/Web%20App/website/subscribe-article_fmlsrq.jpg"
                        }
                        alt="subscribe to news letter"
                        className="h-full object-cover w-full"
                    />

                    <div className="absolute bg-white rounded-md px-[22px] pt-7 pb-16 bottom-8 left-8 max-sm:left-3.5 w-[51%] max-lg:w-[93%]">
                        <h3 className="font-rocGroteskBold text-2xl leading-[34.56px] !text-gun-metal">
                            Navigate with The North Star
                        </h3>
                        <p className="text-sm font-rocGrotesk !text-mvx-neutral mt-3.5 mb-7 w-[80%] max-sm:w-full">
                            Subscribe to our newsletter to read our latest articles on international
                            trade and growing your freight business.
                        </p>
                        <div className="w-[70%] max-sm:w-[80%] grid grid-cols-[80%,1fr] items-center">
                            <input
                                className={`border text-sm font-rocGroteskMedium h-[48px] px-3 border-[#DFE1E6] border-r-0 !text-[#6B778C] rounded-l py-[9.3px] bg-inherit translate-y-[.2px] placeholder:text-[11px] placeholder:font-rocGroteskMedium placeholder:text-[#6B778C]`}
                                placeholder="Enter your email address"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <button
                                type="button"
                                className="bg-pacific-cyan font-rocGroteskMedium h-[48px] py-[10.2px] rounded-l-none rounded-r text-base"
                                disabled={!email.match(emailRegex)}
                                onClick={() => {
                                    websiteService.subscribeToNewsletter(
                                        { email },
                                        setEmail,
                                        setSubscribing
                                    );
                                }}
                            >
                                {subscribing ? <Loader size={4} color="white" /> : "Subscribe"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
            <CookiePrompt />
        </div>
    );
};

const Article = ({ img, title, author, date, duration, content, catgory, id }) => {
    return (
        <div className="h-max min-h-[400px] [&_*]:text-white">
            <Link to={`/blog/${catgory}/${id}`}>
                <img src={img} alt={title} className="rounded-lg h-[50%] w-full object-cover" />
            </Link>
            <div className="mt-4 max-lg:bg-gun-metal max-lg:mt-0 max-lg:py-[10px] max-lg:px-2 max-lg:rounded-b-lg">
                <h3 className="capitalize text-lg max-lg:text-xl leading-[25.92px] font-rocGroteskMedium">
                    {title}
                </h3>
                <p className="flex justify-between text-[12px] gap-1 mt-2 mb-3">
                    <span>
                        By: <span className="font-rocGroteskMedium capitalize">{author}</span>{" "}
                        <span className="font-rocGroteskBold">&nbsp; | &nbsp;</span> {date}
                    </span>{" "}
                    <span>{duration}</span>
                </p>
                <p className="leading-[29px] text-sm max-sm:hidden">
                    {truncate(content, {
                        length: 250,
                    })}
                    <Link
                        to={`/blog/${catgory}/${id}`}
                        className="font-rocGroteskBold cursor-pointer ml-1"
                    >
                        Read more
                    </Link>
                </p>
                <Link
                    to={`/blog/${catgory}/${id}`}
                    className="hidden max-sm:block text-sm font-rocGroteskBold cursor-pointer mt-[18px]"
                >
                    Read more
                </Link>
            </div>
        </div>
    );
};

const ArticlesLoading = () => {
    return (
        <div className="h-max min-h-[400px] [&_*]:text-white">
            <Skeleton
                className={
                    "w-[350px] max-lg:w-full h-[220px] !bg-mvx-neutral relative z-10 !rounded-xl "
                }
            />

            <Skeleton className={"w-[150px] max-lg:w-1/2 h-5 !bg-mvx-neutral mt-4"} />

            <Skeleton className={"w-[300px] max-lg:w-[95%] h-3 !bg-mvx-neutral mt-3 mb-4"} />

            <Skeleton className={"w-[350px] max-lg:w-full h-3 !bg-mvx-neutral mb-3"} />
            <Skeleton className={"w-[350px] max-lg:w-full h-3 !bg-mvx-neutral mb-3"} />
            <Skeleton className={"w-[350px] max-lg:w-full h-3 !bg-mvx-neutral mb-3"} />
            <Skeleton className={"w-[350px] max-lg:w-full h-3 !bg-mvx-neutral mb-3"} />
            <Skeleton className={"w-[350px] max-lg:w-full h-3 !bg-mvx-neutral mb-3"} />
            <Skeleton className={"w-[200px] max-lg:w-full h-3 !bg-mvx-neutral mb-3"} />
        </div>
    );
};

export default Blog;
