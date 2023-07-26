import TinyButton from "../Button/TinyButton";

interface AppAuthorCard extends User {
  onFollow: (userId: string) => void
  isFollowed: boolean,
  isCertified: boolean
}

export default function AuthorCard({_id, onFollow, name, profession, avatar, isFollowed, isCertified }: AppAuthorCard) {
  return (
    <div className="flex mb-3 flex-shrink-0">
      <div className="h-[80px] w-[80px] bg-black rounded-xl overflow-hidden mr-2 shrink-0">
        <img className="w-full h-full object-cover" src={avatar.url || "images/avatar.png"} alt="" />
      </div>
      <div className="shrink-0 overflow-hidden text-clip sm:w-full max-w-[160px]">
        <div className="mb-3">
          <div className="flex items-center text-white01 text-[18px] font-medium">
            <a href={`/profile/${_id}`} className="">{name}</a>
            {isCertified && <div className="icon-Verified text-xl ml-1 text-primary translate-y-[1px]"></div>}
          </div>
          <p className="text-white03 text-xs">{profession}</p>
        </div>

        <TinyButton
          content={isFollowed ? "Followed" : "Follow"}
          iconPos="none"
          handleClick={() => {if (_id) onFollow(_id)}}
        />
      </div>
    </div>
  );
}