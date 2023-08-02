import {motion} from "framer-motion";

export default function Card({title, description, time, authorName, coverImage, blogUrl, myStyles, index, _id} : AppCard) : JSX.Element {
  return(
    <motion.div 
      className={`grid card grid-cols-[38vw] grid-rows-[38vw_max-content] sm:grid-cols-[25vw] lg:grid-cols-[240px] sm:grid-rows-[25vw_max-content] lg:grid-rows-[240px_max-content] w-max sm:w-[25vw] lg:w-[240px] h-max gap-2 lg:gap-4 rounded-2xl ${myStyles}`}
      variants={{
        hidden: {
          opacity: 0,
          y: 20 
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            ease: "easeIn",
            duration: 0.5,
            bounce: 0.3,
            delay: 0.2 * (index && index < 5 ? index : 2)
          }
        }
      }}
      initial={"hidden"}
      whileInView={"visible"}
      viewport={{once: true}}  
    >
      <img className="rounded-2xl object-cover w-[38vw] h-[38vw] sm:w-[25vw] sm:h-[25vw] lg:w-[240px] lg:h-[240px]" src={`${coverImage || "images/placeholder5400x400.png"}`} alt="coverImage"/>
     
      <section className="h-max">
        <div className="text-[18px] sm:text-[20px] font-medium text-white02 overflow-hidden line-clamp-2">
          <a href={blogUrl}>{title}</a>
        </div>
        
        <ul className="sm:flex lg:flex-row flex-col text-white03 gap-2 sm:gap-2 text-[10px] sm:text-xs mb-[6px] sm:my-1">
          <li className="flex items-center">
            <span className="icon-Author small-icon text-primary mr-1"></span>
            <a className="hover:text-primary" href={`/profile/${_id}`}>
              {authorName}
            </a>
          </li>
          <li className="flex">
            <span className="icon-Access-time small-icon text-primary mr-1"></span>
            {time}
          </li>
        </ul>

        <p className="text-white03 text-[10px] sm:text-xs h-auto line-clamp-2 sm:line-clamp-3 overflow-hidden">
          {description}
        </p>
      </section>
    </motion.div>
  )
}