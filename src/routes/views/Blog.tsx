import Button from "../../components/Button/Button";
import TinyButton from "../../components/Button/TinyButton";
import AuthorCard from "../../components/Card/AuthorCard";
import Comment from "../../components/Comment/Comment";
import { useLoaderData, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeHighlight from "rehype-highlight/lib";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import getToken from "../../helpers/getLocalStorage";
import { formatDate } from "../../helpers/dateFormatting";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { localhostIP } from "../../App"; 
import { updateNotification } from "../../features/pageNotification/pageNotificationSlice";
import { deleteRequest, postRequest, putRequest } from "../../helpers/fetchData";

type loadedBlogData = {
  blogData: Blog,
  blogNotification: PageNotification
}

export default function Blog() {
  //Get blog info:
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userData);

  const loadedData = useLoaderData() as loadedBlogData;

  const [blogData, setBlogData] = useState<Blog>({ ...loadedData.blogData, attachedImages: loadedData.blogData.attachedImages });

  const [acceptTerm, setAcceptTerm] = useState<boolean>(false);

  const [hasFollowed, setHasFollowed] = useState<Boolean>(user ? user.follows?.includes(blogData.author._id as string) as boolean : false);

  const [hasBookmarked, setHasBookmarked] = useState<Boolean>(user ? user.bookmark?.includes(blogData._id) as boolean : false);

  const userComment = useRef<string>("");
  const commentBox = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  // Post comment
  const submitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userComment.current === "") return dispatch(updateNotification({
      show: true,
      message: "Can't post empty comments",
      type: "bg-warning"
    }));

    const accessToken = await getToken("access");

    await postRequest(`http://${localhostIP}:3001/api/comment/${blogData._id}`, accessToken || "", {
      blogAuthor: blogData.author._id,
      content: userComment.current,
      createAt: formatDate(new Date())
    });
    navigate(0);
  }

  const deleteComment = async (id: string) => {
    const accessToken = await getToken("access");

    await deleteRequest(`http://${localhostIP}:3001/api/comment/${id}`, accessToken);
    navigate(0);
  }

  const handleVote = async (type: string) => {
    if (user._id === "") {
      return dispatch(updateNotification({
        show: true,
        message: "Please login first",
        type: "bg-error"
      }));
    }

    const accessToken = await getToken("access");

    await putRequest<Blog>(`http://${localhostIP}:3001/api/blog/vote?id=${blogData._id}&method=${type}`, accessToken || "", {})
      .then((res) => {
        setBlogData(prev => {
          return {
            ...prev,
            likedBy: res?.data?.likedBy as string[],
            dislikedBy: res?.data?.dislikedBy as string[],
            likesCount: res?.data?.likesCount as number,
            dislikesCount: res?.data?.dislikesCount as number
          }
        });
      });
  }

  const commentVote = async (commentId: string, type: string) => {
    if (user._id === "") {
      return dispatch(updateNotification({
        show: true,
        message: "Please login first",
        type: "bg-error"
      }));
    }

    const accessToken = await getToken("access");
    await putRequest<Blog>(`http://${localhostIP}:3001/api/comment/vote?id=${commentId}&method=${type}`, accessToken || "", {
      blogid: blogData._id
    })
    .then(res => {
      setBlogData(res?.data as Blog);
    });
    //navigate(0);
  }

  const handleBookmark = async () => {
    if (user._id === "") {
      return dispatch(updateNotification({
        show: true,
        message: "Please login first",
        type: "bg-error"
      }));
    }

    const accessToken = await getToken("access");
    await putRequest(`http://${localhostIP}:3001/api/interact/bookmark?id=${blogData._id}`, accessToken || "", {})
    .then(res => {
      if (res?.message === "Bookmark removed!") {
        setHasBookmarked(false);
      } else {
        setHasBookmarked(true);
      }
    });

    //navigate(0);
  }

  const handleFollow = async (userId: string) => {
    if (user._id === "") {
      return dispatch(updateNotification({
        show: true,
        message: "Please login first",
        type: "bg-error"
      }));
    }

    if (user._id === blogData.author._id) {
      return dispatch(updateNotification({
        show: true,
        message: "You can't follow yourself",
        type: "bg-warning"
      }));
    }

    const accessToken = await getToken("access");
    await putRequest(`http://${localhostIP}:3001/api/interact/follow?id=${userId}`, accessToken || "", {})
    .then(res => {
      if (res?.message === "Unfollowed!") {
        setHasFollowed(false);
      } else {
        setHasFollowed(true);
      }
    });

    //navigate(0);
  }

  return (
    <div className="scroll-smooth">
      <Helmet>
        <title>{(user.notifications.length > 0) ? `(${user.notifications.length})` : ""} {blogData.title}</title>
        <meta name="description" content={blogData.description} />
      </Helmet>

      <div className="bg-secondary w-[96vw] h-max rounded-3xl mx-auto p-1 mt-[8vh] relative">
        <div className="bg-black w-full h-full rounded-[22px] px-8 py-[60px]">
          {/* BLOG CONTENT */}
          <div className="absolute top-[-20px] sm:top-[-32px] left-7 sm:left-8 px-2 text-white bg-black">
            <h1 className="text-[6vw] sm:text-[32px]">
              {blogData.title}
            </h1>
            <ul className="flex text-white03 space-x-1 sm:space-x-2 text-[10px] sm:text-xs my-0 sm:my-1">
              <li className="flex">
                <span className="icon-Access-time h-[12px] sm:h-[16px] w-[12px] sm:w-[16px] text-[12px] sm:text-[16px] translate-y-[1.1px] sm:translate-y-0 text-primary mr-[3px] sm:mr-1"></span>
                <p>
                  {blogData.time}
                </p>
              </li>
              <li className="flex">
                <span className="icon-Thumb-up h-[12px] sm:h-[16px] w-[12px] sm:w-[16px] text-[12px] sm:text-[16px] translate-y-[1.1px] sm:translate-y-0 text-primary mr-[3px] sm:mr-1"></span>
                <p>
                  {blogData.likesCount}
                </p>
              </li>
              <li className="flex">
                <span className="icon-Visibility h-[12px] sm:h-[16px] w-[12px] sm:w-[16px] text-[12px] sm:text-[16px] translate-y-[1.1px] sm:translate-y-0 text-primary mr-[3px] sm:mr-1"></span>
                <p>
                  {blogData.viewsCount}
                </p>
              </li>
            </ul>
          </div>

          <div className="absolute left-[-10px] sm:left-[-21px] space-y-3">
            <div className="w-max h-max p-[2px] sm:p-[6px] bg-black rounded-full">
              {
                blogData.likedBy?.includes(user?._id as string) ?
                  <Button
                    iconPos="none"
                    icon="icon-Thumb-up"
                    handleClick={async () => await handleVote("like")}
                  />
                  : <Button
                    iconPos="none"
                    icon="icon-Thumb-up-outline"
                    handleClick={async () => await handleVote("like")}
                  />
              }
            </div>
            <div className="w-max h-max p-[2px] sm:p-[6px] bg-black rounded-full">
              {
                blogData.dislikedBy?.includes(user?._id as string) ?
                  <Button
                    iconPos="none"
                    icon="icon-Thumb-down"
                    handleClick={async () => await handleVote("dislike")}
                  />
                  : <Button
                    iconPos="none"
                    icon="icon-Thumb-down-outline"
                    handleClick={async () => await handleVote("dislike")}
                  />
              }
            </div>
            <div className="w-max h-max p-[2px] sm:p-[6px] bg-black rounded-full">
              <Button
                iconPos="none"
                icon="icon-Add-comment"
                handleClick={() => {
                  commentBox.current?.scrollIntoView({
                    behavior: "smooth"
                  });
                  commentBox.current?.focus({
                    preventScroll: true
                  });
                }}
              />
            </div>
            <div className="w-max h-max p-[2px] sm:p-[6px] bg-black rounded-full">
              {
                hasBookmarked ?
                  <Button
                    iconPos="none"
                    icon={"icon-Bookmark"}
                    handleClick={handleBookmark}
                  /> :
                  <Button
                    iconPos="none"
                    icon="icon-Bookmark-border"
                    handleClick={handleBookmark}
                  />
              }
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-[65%_33%] gap-x-[2%]">
            <div className="w-full max-w-[864px]">
              <div className="rounded-2xl w-full max-h-[400px] overflow-hidden mb-10">
                <img className="w-full h-full object-cover" src={blogData.coverImage} alt="" />
              </div>

              {/* CONTENT */}
              <div className="w-full blog-content text-white03 text-sm sm:text-base">
                <ReactMarkdown className="whitespace-pre-wrap" remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {blogData.content}
                </ReactMarkdown>
              </div>


            </div>
            <div className="w-full mt-7 min-w-[258px] h-max lg:mt-0">
              <div className="relative w-full">
                <div className="absolute left-0 w-full bg-secondary h-[2px] center"></div>
                <h3 className="relative w-max bg-black pr-2 text-white02 mb-2">Author</h3>
              </div>

              {
                user ?
                  <AuthorCard
                    _id={blogData.author._id}
                    onFollow={handleFollow}
                    name={blogData.author.name}
                    profession={blogData.author.profession}
                    isFollowed={hasFollowed as boolean}
                    avatar={blogData.author.avatar}
                    isAdmin={blogData.author.isAdmin}
                    isCertified={blogData.author.isCertified as boolean}
                    notifications={[]}
                  /> :
                  <AuthorCard
                    onFollow={handleFollow}
                    name={blogData.author.name}
                    profession={blogData.author.profession}
                    isFollowed={false}
                    avatar={blogData.author.avatar}
                    isAdmin={blogData.author.isAdmin}
                    isCertified={blogData.author.isCertified as boolean}
                    notifications={[]}
                  />
              }

              <div className="relative w-full">
                <div className="absolute left-0 w-full bg-secondary h-[2px] center"></div>
                <h3 className="relative w-max bg-black pr-2 text-white02 mb-2">Similar</h3>
              </div>

              <div className="space-y-3">
                <a href="/" className="flex">
                  <img className="shrink-0 rounded-lg mr-2 overflow-hidden w-[80px] h-[80px] object-cover" src="images/placeholder140x140.png" alt="coverImage" />
                  <div>
                    <div className="flex items-center">
                      <p className="text-white02 font-medium">Mock Article</p>
                      <span className="text-white03 text-xs mx-2">December 20, 2021</span>
                    </div>
                    <p className="text-xs text-white03 line-clamp-3">In hac habitasse platea dictumst. Proin purus ex, eleifend sit amet lorem accumsan, varius eleifend mi. Sed at enim lacus. Sed fermentum iaculis egestas.</p>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* COMMENTS */}
      <section className="w-[96vw] h-max mx-auto mt-9 relative flex flex-col-reverse lg:flex-row">
        <div className="w-full lg:w-[65vw] lg:max-w-[820px]">
          <h3 className="text-white mb-3">
            {blogData.commentsCount > 1 ? "Comments" : "Comment"}
            <span className="text-base ml-1 align-middle text-white03">
              {`(${blogData.comments.length})`}
            </span>
          </h3>

          {/* COMMENT LISTS */}
          <div className="w-full h-max pb-7 space-y-7">
            {/* COMMENT BOX */}
            {blogData.comments.length > 0 ?
              blogData.comments.map(comment => {
                return (
                  <Comment
                    _id={comment._id}
                    handleDelete={() => deleteComment(comment._id)}
                    key={comment._id}
                    author={comment.author}
                    content={comment.content}
                    createAt={comment.createAt}
                    likedBy={comment.likedBy as string[]}
                    dislikedBy={comment.dislikedBy as string[]}
                    handleVote={commentVote}
                  />
                )
              }) : <p className="text-white03">Noone commented yet, be the first person to comment</p>
            }
          </div>

          <form
            className="h-max w-full lg:max-w-[820px] mt-3"
            method="post"
            onSubmit={(e) => submitComment(e)}
          >
            <textarea
              id="comment"
              placeholder="Write your thoughts"
              className="bg-white rounded-[10px] w-full h-32 resize-none border-none outline-none text-black mb-1 p-3"
              onChange={(e) => userComment.current = e.target.value}
              spellCheck="false"
              aria-autocomplete="none"
              ref={commentBox}
            ></textarea>
            <div className="sm:flex mt-2">
              {acceptTerm && user ?
                <Button
                  iconPos="back"
                  icon="icon-Send"
                  content="Post comment"
                  type="submit"
                  myStyles="bg-primary"
                /> :
                <Button
                  iconPos="back"
                  icon="icon-Send"
                  content="Post comment"
                  type="button"
                  myStyles="bg-disable"
                />
              }
              <div className="flex flex-shrink-0 sm:ml-4 sm:mt-0 sm:mb-0 mt-2 mb-4 mr-auto w-max h-max translate-y-[5px]">
                <div className="relative w-4 h-4 rounded-[2px] overflow-hidden bg-white mr-1 translate-y-[3.5px]">
                  {acceptTerm && <img className="absolute top-[-4px] left-0 w-[24px] h-[24px] pointer-events-none" src="images/checked.svg" alt="checked" />}
                  <input className="absolute top-0 left-0 opacity-0 cursor-pointer" type="checkbox" onChange={(e) => setAcceptTerm(e.target.checked)} />
                </div>
                <p className="text-white02 sm:text-base text-sm">I've read & agree with <a className="text-primary font-bold" href="/">Vtech terms</a></p>
              </div>
            </div>
          </form>

        </div>

        {/* CATEGORIES */}
        <div className="ml-0 lg:ml-6 w-full lg:w-[30vw]">
          <h3 className="text-white mb-3">Categories</h3>

          <div className="w-full h-max flex flex-wrap mb-4 space-x-2">
            {blogData.categories.length > 0 ?
              blogData.categories.map((category) => {
                return (
                  <TinyButton
                    key={category._id}
                    iconPos="none"
                    content={category._id}
                    myStyles="sm:my-0 my-1 bg-secondary"
                  />
                );
              }) : <p className="text-sm text-white03">No category!</p>}
          </div>

          <h3 className="text-white mb-2">Tags</h3>
          <p className="text-white03 text-sm mb-4 lg:mb-0">
            {blogData.tags.length > 0 ? blogData.tags.join(' ') : "No tag!"}
          </p>
        </div>
      </section>
    </div>
  )
} 