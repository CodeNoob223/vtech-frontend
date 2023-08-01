import { useState } from "react";
import Button from "../../components/Button/Button";
import SmallSelectCard from "../../components/Select/SmallSelectCard";
import SmallCard from "../../components/Card/SmallCard";
import { Helmet } from "react-helmet";
import { useAppSelector } from "../../app/hook";
import { localhostIP } from "../../App";
import { getRequest, postRequest } from "../../helpers/fetchData";

export default function SearchPage() {
    const user = useAppSelector(state => state.userData);
    const [search, setSearch] = useState<string>("");
    const [searchResult, setSearchResult] = useState<Blog[]>([]);
    const [searchQuery, setSearchQuery] = useState({
        categories: ["Sport"] as string[],
        orderBy: "Latest" as string
    });

    const [categories, setCategories] = useState<Option[]>([
        {
            name: "Sport",
            isSelect: true
        }, {
            name: "Gaming",
            isSelect: false
        }, {
            name: "Progamming",
            isSelect: false
        }, {
            name: "Math",
            isSelect: false
        }, {
            name: "Food",
            isSelect: false
        }, {
            name: "Bike",
            isSelect: false
        }
    ]);
    const [orderBy, setOrderBy] = useState<Option[]>([
        {
            name: "Latest",
            isSelect: true
        }, {
            name: "A-Z",
            isSelect: false
        }, {
            name: "Most likes",
            isSelect: false
        }, {
            name: "Most dislikes",
            isSelect: false
        }, {
            name: "Oldest",
            isSelect: false
        }, {
            name: "Most views",
            isSelect: false
        },
    ]);

    const selectCategory = (key: number) => {
        setCategories(prevList => {
            let newList: Option[] = prevList.map((category, index) => {
                if (index === key) {
                    category = { ...category, isSelect: !category.isSelect }

                    if (category.isSelect) {
                        setSearchQuery(prev => {
                            prev.categories.push(category.name)
                            return {
                                orderBy: prev.orderBy,
                                categories: prev.categories
                            }
                        });
                    } else {
                        setSearchQuery(prev => {
                            return {
                                orderBy: prev.orderBy,
                                categories: prev.categories.filter(cat => cat !== category.name)
                            }
                        });
                    }
                }
                return category;
            });
            return newList;
        });
        searchBlog(search);
    };

    const selectOrder = (key: number) => {
        setOrderBy(prevList => {
            let newList: Option[] = prevList.map((order, index) => {
                if (index === key) {
                    order = { ...order, isSelect: true }
                    setSearchQuery({
                        ...searchQuery,
                        orderBy: order.name
                    });
                } else {
                    order = { ...order, isSelect: false }
                }

                return order;
            });
            return newList;
        });
        searchBlog(search);
    };

    const searchBlog = async (searchString: string) => {
        const res = await postRequest<Blog[]>(`${localhostIP}/api/blog/search?title=${searchString || ""}&limit=20&skip=0`, "", {
            categories: searchQuery.categories,
            orderBy: searchQuery.orderBy
        });
        if (res.success) {
            setSearchResult(res.data);
        }
    }

    return (
        <div className="bg-black h-max pb-[200px]">
            <Helmet>
                <title>{(user.notifications.length > 0) ? `(${user.notifications.length})` : ""} Search</title>
                <meta name="description" content="Search for blogs" />
            </Helmet>
            <section className="bg-primary-gradient h-[363px] pt-[72px]">
                <div className="h-max w-max mx-auto">
                    <h1 className="text-center text-white">Search</h1>
                    <div className="w-[90vw] max-w-[600px] search-bar flex mb-6 overflow-hidden rounded-md">
                        <input className="h-[40px] align-middle max-w-[515px] w-[90%] pl-4 text-black font-medium" type="text" placeholder="Search"
                            onFocus={(e) => {
                                setSearch(e.target.value);
                                searchBlog(e.target.value);
                            }}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                searchBlog(e.target.value);
                            }}
                        />
                        <Button
                            content="Search"
                            myStyles="rounded-none bg-primary h-[40px] py-2"
                            iconPos="none"
                            handleClick={() => searchBlog(search)}
                        />
                    </div>
                    <div className="category flex gap-x-1 mb-3 max-w-[600px] flex-wrap w-[90vw]">
                        <p className="text-white text-[14px] mr-[4px]">Categories:</p>
                        {categories.map(
                            (category, index) => {
                                return <SmallSelectCard key={index} handleClick={() => { selectCategory(index) }} content={category.name} select={category.isSelect} />
                            }
                        )}
                    </div>
                    <div className="orderBy flex gap-x-1 max-w-[600px] flex-wrap w-[90vw]">
                        <p className="text-white text-[14px] mr-[4px]">Order by:</p>
                        {orderBy.map(
                            (order, index) => {
                                return <SmallSelectCard key={index} handleClick={() => { selectOrder(index) }} content={order.name} select={order.isSelect} />
                            }
                        )}
                    </div>
                </div>
            </section>
            <section className="text-white">
                <h2 className="text-center mb-10">Results for "{search}"</h2>
                <div className="grid w-max mx-auto 1.5xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5">
                    {searchResult.map((card: Blog, index: number) => {
                        return <SmallCard
                            key={index}
                            coverImage={card.coverImage}
                            authorName={card.author.name}
                            blogUrl={`/blog/${card._id}`}
                            description={card.description as string}
                            likesCount={card.likesCount as number}
                            time={card.time}
                            title={card.title}
                            viewsCount={card.viewsCount as number}
                            myStyles="max-w-[400px]"
                        />
                    })}
                </div>
            </section>
        </div>
    )
} 