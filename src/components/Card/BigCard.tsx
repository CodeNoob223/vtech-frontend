import ButtonLink from "../Button/ButtonLink";
import { motion } from "framer-motion";

export default function BigCard({_id, title, description, likesCount, time, authorName, viewsCount, coverImage, blogUrl, myStyles }: AppCard): JSX.Element {
  return (
    <motion.div
      className={`relative bigCard min-[1080px]:w-[570px] h-[360px] rounded-3xl overflow-hidden w-[85vw] md:w-full ${myStyles}`}
      variants={{
        hidden: {
          opacity: 0,
          x: -20
        },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.6
          }
        }
      }}
      initial={"hidden"}
      animate={"visible"}
    >

      <img className="absolute top-0 left-0 object-cover w-full h-full" src={`${coverImage || "images/cover.png"}`} alt="cover image" />

      <div className="absolute top-0 left-0 w-full h-full image-cover"></div>

      <div className="absolute top-36 sm:top-40 left-8 text-white02 overflow-hidden sm:w-[440px] sm:h-[124px]">
        <div className="text-[24px] font-bold text-white02 truncate">
          <a href={blogUrl}>{title}</a>
        </div>

        <ul className="w-[80%] sm:w-auto sm:flex text-white03 sm:space-x-2 font-attribute mt-1 mb-3">
          <li className="flex">
            <div className="flex mr-2 sm:mb-0 mb-1">
              <span className="icon-Author small-icon text-primary mr-1"></span>
              <a className="hover:text-primary" href={`/profile/${_id}`}>
                {authorName}
              </a>
            </div>
            <div className="flex">
              <span className="icon-Access-time small-icon text-primary mr-1"></span>
              {time}
            </div>
          </li>
          <li className="flex">
            <div className="flex mr-2">
              <span className="icon-Thumb-up small-icon text-primary mr-1"></span>
              {likesCount}
            </div>
            <div className="flex">
              <span className="icon-Visibility small-icon text-primary mr-1"></span>
              {viewsCount}
            </div>
          </li>
        </ul>

        <p className="text-white03 w-[80%] sm:w-auto text-xs sm:line-clamp-3 line-clamp-2 overflow-hidden">
          {description}
        </p>
      </div>
      <ButtonLink
        to={blogUrl}
        content="Read more"
        icon="icon-Visibility"
        iconPos="back"
        myStyles="absolute bg-primary hover:bg-secondary transition-all duration-300 font-normal left-8 bottom-8"
      />
    </motion.div>
  )
}