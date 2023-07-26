import Button from "../Button/Button";
import { useAppSelector } from "../../app/hook";

export default function Comment({ _id, handleVote, handleDelete, content, author, createAt, likedBy, dislikedBy }: BlogComment) {
  const user = useAppSelector(state => state.userData);

  return (
    <div id={_id} className="bg-secondary w-full h-max min-h-[128px] lg:max-w-[820px] p-[3px] rounded-[13px] relative">
      <div className="w-full h-max min-h-[124px] bg-black p-5 flex rounded-[11px]">
        <div className="h-[80px] w-[80px] bg-black rounded-xl overflow-hidden mr-2 flex-shrink-0">
          <img className="w-full h-full object-cover" src={author.avatar.url || `images/avatar.png`} alt="" />
        </div>
        <div className="mb-3">
          <div className="text-white02 text-sm sm:text-[18px] font-medium sm:flex sm:items-center mb-1">
            <a href={`/profile/${author._id}`}>{author.name}</a>
            {author.isCertified && <span className="icon-Verified ml-1 text-primary"></span>}
            <p className="text-white03 text-[11px] ml-2 sm:text-xs">{createAt}</p>
          </div>

          <p className="text-white03 text-[12.5px] sm:text-sm">
            {content}
          </p>
        </div>
        <div className="absolute flex space-x-4 bottom-[-24px]">
          <div className="w-max h-max p-[4px] bg-black rounded-full">
            {
              likedBy.includes(user?._id as string) ?
                <Button
                  iconPos="none"
                  icon={"icon-Thumb-up"}
                  handleClick={() => handleVote(_id, "like")}
                /> :
                <Button
                  iconPos="none"
                  icon={"icon-Thumb-up-outline"}
                  handleClick={() => handleVote(_id, "like")}
                />
            }
          </div>
          <div className="w-max h-max p-[4px] bg-black rounded-full">
            {
              dislikedBy.includes(user?._id as string) ?
                <Button
                  key={Math.random()}
                  iconPos="none"
                  icon={"icon-Thumb-down"}
                  handleClick={() => handleVote(_id, "dislike")}
                /> :
                <Button
                  key={Math.random()}
                  iconPos="none"
                  icon={"icon-Thumb-down-outline"}
                  handleClick={() => handleVote(_id, "dislike")}
                />
            }
          </div>

          {(user && (user._id == author._id)) &&
            <div className="w-max h-max p-[4px] bg-black rounded-full ml-[8vw]">
              <Button
                iconPos="none"
                icon="icon-Delete"
                myStyles="bg-error"
                handleClick={() => handleDelete()}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}