import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import SmallSelectCard from "../../components/Select/SmallSelectCard";
import SmallCard from "../../components/Card/SmallCard";
import { Helmet } from "react-helmet";
import { useAppSelector } from "../../app/hook";
import { localhostIP } from "../../App";
import { getRequest, postRequest } from "../../helpers/fetchData";
import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
    const [searchParams] = useSearchParams();;
    const user = useAppSelector(state => state.userData);
    const [search, setSearch] = useState<string>(
        searchParams.get("title") || ""
    );
    const [searchResult, setSearchResult] = useState<Blog[]>([]);
    const [searchCat, setSearchCat] = useState<SearchResult<Category>>({
        isFocus: false,
        results: []
    });
    
    const [categories, setCategories] = useState<Category[]>(
    searchParams.get("category") ?    
    [{
        _id: searchParams.get("category") as string,
        imageUrl: ""
    }] : []);
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

    const addCategory = (value: Category) => {
        const newCategoryList: Category[] = categories;
        if (!newCategoryList.some(element => {
            if (element._id === value._id) return true;

            return false;
        })) {
            newCategoryList.push(value);
        }
        setCategories(newCategoryList);
    }

    const selectOrder = (key: number) => {
        setOrderBy(prevList => {
            let newList: Option[] = prevList.map((order, index) => {
                if (index === key) {
                    order = { ...order, isSelect: true }
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
            categories: categories.map(cat => `${cat._id}`),
            orderBy: orderBy.filter(order => order.isSelect).map(or => `${or.name}`)
        });
        if (res.success) {
            setSearchResult(res.data);
        }
    }

    useEffect(() => {
        searchBlog(search);
    }, [categories]);

    const searchCategory = async (searchString: string) => {
        const { data } = await getRequest<Category[]>(`${localhostIP}/api/category?name=${searchString}&limit=6`);
        setSearchCat(prev => {
            return {
                ...prev,
                results: data as Category[]
            }
        });
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
                    <div className="category flex gap-1 mb-3 max-w-[600px] flex-wrap w-[90vw] h-max items-center">
                        <p className="text-white text-[14px] mr-[4px]">Categories:</p>
                        {categories.map(
                            (category, index) => {
                                return <SmallSelectCard key={index} handleClick={() => { setCategories(prev => prev.filter(c => c._id !== category._id)) }} content={category._id} select={true} />
                            }
                        )}
                        <div className="flex flex-col relative">
                            <input
                                name="categories"
                                autoComplete="off"
                                type="text"
                                className="block w-[80%] min-w-[300px] h-[24px] font-sm rounded-sm pl-2"
                                placeholder="Add categories"
                                onChange={async (e) => {
                                    await searchCategory(e.target.value);
                                }}
                                onFocus={async (e) => {
                                    setSearchCat(prev => { return { ...prev, isFocus: true } });
                                    await searchCategory(e.target.value);
                                }}
                                onBlur={() => setTimeout(() => setSearchCat(prev => { return { ...prev, isFocus: false } }), 300)}
                                maxLength={40}
                            />
                            <div className={`absolute h-max w-full max-h-[120px] lg:max-h-[320px] top-[24px] left-0 rounded-sm overflow-y-scroll z-10 cursor-pointer ${!searchCat.isFocus && "hidden"}`}>
                                {searchCat.results.map((result: Category) => {
                                    return (
                                        <div key={result._id} className="h-[40px] w-full bg-slate-50 hover:bg-slate-200 pt-2 pl-2"
                                            onClick={() => {
                                                addCategory(result);
                                            }}
                                        >
                                            {result._id}
                                        </div>)
                                })}
                            </div>
                        </div>
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
                            _id={card.author._id!}
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