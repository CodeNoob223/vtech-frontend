import {motion} from "framer-motion";

export default function SmallCard({title, description, likesCount, time, authorName, viewsCount, coverImage, blogUrl, myStyles} : AppCard) : JSX.Element {
  return(
    <motion.div 
      className={`grid smallCard grid-cols-smallCard h-max gap-2 sm:gap-3 rounded-2xl w-full ${myStyles}`}
      variants={{
        hidden: {
          opacity: 0,
          x: 20
        },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.6,
            bounce: 0.3
          }
        }
      }}
      viewport={{once: true}}
    >
      <img className="rounded-lg overflow-hidden w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] object-cover" src={`${coverImage || "images/placeholder140x140.png"}`} alt="coverImage"/>
    
      <section className="sm:w-full w-[40vw]">
        <div className="font-medium text-white02 sm:text-lg text-sm">
          <a href={blogUrl}>{title}</a>
        </div>
        
        <ul className="w-full sm:w-auto sm:flex flex-wrap flex-shrink-0 text-white03 sm:space-x-2 font-attribute my-1">
          <li className="sm:flex sm:w-max w-full">
            <div className="flex mr-2 sm:mb-0 mb-1">
              <span className="icon-Author small-icon text-primary mr-1"></span>
              {authorName}
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

        <p className="text-white03 text-xs h-max line-clamp-1 sm:line-clamp-3">
          {description}
        </p>
      </section>
    </motion.div>
  )
}