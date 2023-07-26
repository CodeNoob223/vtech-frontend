import BigCard from "../../components/Card/BigCard";
import SmallCard from "../../components/Card/SmallCard";
import Card from "../../components/Card/Card";
import { Helmet } from "react-helmet";
import { useAppSelector } from "../../app/hook";
import { useEffect, useRef, useState } from "react";
import { getRequest } from "../../helpers/fetchData";
import { localhostIP } from "../../App";
import MainFallBack, { CardFallBack } from "../fallbacks/MainFallBack";
import { motion } from "framer-motion";

type MainPageData = {
  success: boolean,
  message: string,
  latests: Blog[],
  mostLikes: Blog[],
  categories: Category[]
};
export const LoremIpsum = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

export default function Main() {
  const isMore = useRef<boolean>(true);
  const skip = useRef<number>(4);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const [pageData, setPageData] = useState<MainPageData>({
    success: false,
    message: "",
    latests: [],
    mostLikes: [],
    categories: []
  });

  async function fetchMoreData(skipping : number) {
    if (isMore.current) {
      setIsBottom(true);
      skip.current += 4;

      getRequest<Blog[]>(`http://${localhostIP}:3001/api/blog/all?limit=4&skip=${skipping}`).then(res => {
        if (res.data.length > 0) {
          setPageData(data => {
            return {
              ...data,
              latests: data.latests.concat(res.data)
            }
          });
          
        } else {
          isMore.current = false;
        }
      }).then(() => {
        setIsBottom(false);
      });
    }
  };

  useEffect(() => {
    getRequest<MainPageData>(`http://${localhostIP}:3001/api/blog/main?limit=4`, "", {}, true).then(res => {
      setPageData(res as MainPageData);
      setIsLoading(false);
    });
  }, []);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 < document.documentElement.offsetHeight - 400 || isBottom) {
      return;
    }
    if (isMore.current) fetchMoreData(skip.current);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const user = useAppSelector(state => state.userData);

  if (isLoading) {
    return <MainFallBack />
  } else {
    return (
      <div className="container max-w-[1280px] sm:mx-auto pt-9 h-max">
        <Helmet>
          <title>{(user.notifications.length > 0) ? `(${user.notifications.length})` : ""} Home</title>
          <meta name="description" content="Read latest blog, written by professional!" />
        </Helmet>
        <div className="grid grid-banner w-full max-w-[1080px] px-6 sm:px-0 sm:mx-auto">
          <h2 className="text-primary banner-title-1">Feature</h2>
          <h2 className="text-primary banner-title-2">Most likes</h2>
          {
            pageData.latests[0] ?
              <BigCard
                title={pageData.latests[0].title}
                likesCount={pageData.latests[0].likesCount}
                time={pageData.latests[0].time}
                authorName={pageData.latests[0].author.name}
                viewsCount={pageData.latests[0].viewsCount}
                description={pageData.latests[0].description}
                blogUrl={`/blog/${pageData.latests[0]._id}`}
                myStyles="banner-big-card"
                coverImage={pageData.latests[0].coverImage}
              />
              : <BigCard
                title={`Welcome to Vtech`}
                likesCount={4}
                time="December 26, 2021"
                authorName="Dinh Hai"
                viewsCount={4}
                description={LoremIpsum}
                blogUrl="/blog/649cf06ecc6d0202f386303d"
                myStyles="banner-big-card"
              />
          }
          <motion.section
            variants={{
              hidden: {
                opacity: 0
              },
              visible: {
                opacity: 1,
                transition: {
                  duration: 0.6,
                  delayChildren: 0.3,
                  staggerChildren: 0.3
                }
              }
            }}
            initial={"hidden"}
            animate={"visible"}
            viewport={{ once: true }}
            className="grid grid-flow-row gap-4 max-h-[740px] lg:flex lg:flex-col overflow-y-scroll custom-sb overflow-x-hidden lg:gap-[15px] banner-card-list">
            {
              pageData.mostLikes && pageData.mostLikes.map(blog => {
                return <SmallCard
                  key={blog._id}
                  title={blog.title}
                  likesCount={blog.likesCount}
                  time={blog.time}
                  authorName={blog.author.name}
                  viewsCount={blog.viewsCount}
                  description={blog.description}
                  coverImage={blog.coverImage}
                  blogUrl={`/blog/${blog._id}`}
                />
              })
            }
            <SmallCard
              title={`Sample title`}
              likesCount={4}
              time="December 26, 2021"
              authorName="Dinh Hai"
              viewsCount={4}
              description={LoremIpsum}
              coverImage=""
              blogUrl="/blog/649cf06ecc6d0202f386303d"
            />
            <SmallCard
              title={`Sample title 2`}
              likesCount={4}
              time="December 26, 2021"
              authorName="Dinh Hai"
              viewsCount={4}
              description={LoremIpsum}
              coverImage=""
              blogUrl="/blog/649cf06ecc6d0202f386303d"
            />
            <SmallCard
              title={`Sample title 3`}
              likesCount={4}
              time="December 26, 2021"
              authorName="Dinh Hai"
              viewsCount={4}
              description={LoremIpsum}
              coverImage=""
              blogUrl="/blog/649cf06ecc6d0202f386303d"
            />
            <SmallCard
              title={`Sample title 4`}
              likesCount={4}
              time="December 26, 2021"
              authorName="Dinh Hai"
              viewsCount={4}
              description={LoremIpsum}
              coverImage=""
              blogUrl="/blog/649cf06ecc6d0202f386303d"
            />
            <SmallCard
              title={`Sample title 5`}
              likesCount={4}
              time="December 26, 2021"
              authorName="Dinh Hai"
              viewsCount={4}
              description={LoremIpsum}
              coverImage=""
              blogUrl="/blog/649cf06ecc6d0202f386303d"
            />
          </motion.section>
          <h2 className="text-primary category-title">Categories</h2>
          {/* <section className="flex h-[360px] w-full overflow-x-scroll overflow-y-hidden custom-sb category-list gap-x-5 sm:gap-x-6"> */}
          <section className="overflow-x-hidden h-[360px] category-list gap-x-5 sm:gap-x-6">
            <div className="w-max flex gap-4 scroll-right">
              {pageData.categories && pageData.categories.map(category => {
                return <a key={category._id} className="text-[60px] text-category font-bold" href={`/search?tag=${category._id}`} target="_blank">{category._id}</a>
              })}
            </div>
            <div className="w-max flex gap-4 scroll-left">
              {pageData.categories && pageData.categories.reverse().map(category => {
                return <a key={category._id} className="text-[60px] text-category font-bold" href={`/search?tag=${category._id}`} target="_blank">{category._id}</a>
              })}
            </div>
            <div className="w-max flex gap-4 scroll-right">
              {pageData.categories && pageData.categories.map(category => {
                return <a key={category._id} className="text-[60px] text-category font-bold" href={`/search?tag=${category._id}`} target="_blank">{category._id}</a>
              })}
            </div>
            <div className="w-max flex gap-4 scroll-left">
              {pageData.categories && pageData.categories.reverse().map(category => {
                return <a key={category._id} className="text-[60px] text-category font-bold" href={`/search?tag=${category._id}`} target="_blank">{category._id}</a>
              })}
            </div>
          </section>
          <h2 className="text-primary banner-title-3">Latests</h2>
          <section className="grid min-[1080px]:grid-cols-4 min-[1080px]:place-items-start min-[1080px]:gap-[24px] gap-[12px] sm:grid-cols-3 sm:place-items-start grid-cols-2 banner-card-cols mb-[200px]">
            {
              pageData.latests && pageData.latests.map((blog, index) => {
                return <Card
                  key={index}
                  index={index + 1}
                  coverImage={blog.coverImage}
                  title={blog.title}
                  likesCount={blog.likesCount}
                  time={blog.time}
                  authorName={blog.author.name}
                  viewsCount={blog.viewsCount}
                  description={blog.description}
                  blogUrl={`/blog/${blog._id}`}
                />
              })
            }
            {
              isBottom && [0, 1, 2, 3].map(child => {
                return <CardFallBack key={child} />
              })
            }
          </section>
        </div>
      </div>
    );
  }
}