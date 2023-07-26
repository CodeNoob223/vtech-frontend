import { Helmet } from "react-helmet";

export function FallBackBigCard(): JSX.Element {
    return (
        <div className={`relative bigCard min-[1080px]:w-[570px] h-[360px] rounded-3xl overflow-hidden w-[85vw] md:w-full`}>
            <div className="absolute top-0 left-0 w-full h-full bg-secondary-no-gr animate-pulse">
            </div>
            <div className="absolute top-36 sm:top-40 left-8 text-white02 overflow-hidden sm:w-[440px] sm:h-[124px] animate-pulse">
                <div className="text-[24px] font-boldtruncate text-transparent">
                    <span className="bg-purple-950 rounded-full h-max">LOADING LOADING</span>
                </div>

                <ul className="w-[80%] sm:w-auto sm:flex text-transparent sm:space-x-2 font-attribute mt-1 mb-3">
                    <li className="flex">
                        <div className="flex mr-2 sm:mb-0 mb-1">
                            <span className="icon-Author small-icon text-purple-950 mr-1"></span>
                            <span className="bg-purple-950 rounded-full h-max">LOADING</span>
                        </div>
                        <div className="flex">
                            <span className="icon-Access-time small-icon text-purple-950 mr-1"></span>
                            <span className="bg-purple-950 rounded-full h-max">LOADING LOADING</span>
                        </div>
                    </li>
                    <li className="flex ">
                        <div className="flex mr-2">
                            <span className="icon-Thumb-up small-icon text-purple-950 mr-1"></span>
                            <span className="bg-purple-950 rounded-full h-max">LDD</span>

                        </div>
                        <div className="flex">
                            <span className="icon-Visibility small-icon text-purple-950 mr-1"></span>
                            <span className="bg-purple-950 rounded-full h-max">LDD</span>

                        </div>
                    </li>
                </ul>

                <div className="text-transparent w-[80%] sm:w-auto text-xs sm:line-clamp-3 line-clamp-2 overflow-hidden">
                    <p className="mb-2">
                        <span className="bg-purple-950 rounded-full h-max">LOADING LOADING LOADING</span>
                        <span className="bg-purple-950 rounded-full h-max mx-2">LOADING LOADING LOADING LOADING</span>
                    </p>
                    <p className="mb-2">
                        <span className="bg-purple-950 rounded-full h-max">LOADING LOADING LOADING LOADING</span>
                        <span className="bg-purple-950 rounded-full h-max mx-2">LOADING LOADING</span>
                        <span className="bg-purple-950 rounded-full h-max">LOADING</span>
                    </p>
                </div>
            </div>

            <div className="absolute bg-purple-950 w-[140px] h-[35px] cursor-not-allowed animate-pulse font-normal left-8 bottom-8 rounded-full">

            </div>

        </div>
    );
}

export function FallBackSmallCard(): JSX.Element {
    return <div className={`grid smallCard grid-cols-smallCard h-full gap-2 sm:gap-3 rounded-2xl w-full`}>
        <div className="rounded-lg overflow-hidden w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] bg-secondary-no-gr"></div>

        <section className="w-full animate-pulse">
            <div className="font-medium w-max text-transparent bg-purple-950 rounded-full h-max sm:text-lg text-sm mb-3">
                LOADING LOADING
            </div>

            <ul className="w-full sm:w-auto sm:flex flex-wrap text-xs flex-shrink-0 text-transparent sm:space-x-2 font-attribute my-1">
                <li className="sm:flex sm:w-max w-full">
                    <div className="flex mr-2 sm:mb-0 mb-1">
                        <span className="icon-Author small-icon text-purple-950 mr-1"></span>
                        <span className="bg-purple-950 rounded-full h-max">LOADING</span>
                    </div>
                    <div className="flex">
                        <span className="icon-Access-time small-icon text-purple-950 mr-1"></span>
                        <span className="bg-purple-950 rounded-full h-max">20 December</span>
                        <span className="bg-purple-950 rounded-full h-max ml-2">2023</span>
                    </div>
                </li>
                <li className="flex">
                    <div className="flex mr-2">
                        <span className="icon-Thumb-up small-icon text-purple-950 mr-1"></span>
                        <span className="bg-purple-950 rounded-full h-max">4</span>
                    </div>
                    <div className="flex">
                        <span className="icon-Visibility small-icon text-purple-950 mr-1"></span>
                        <span className="bg-purple-950 rounded-full h-max">4</span>
                    </div>
                </li>
            </ul>

            <div className="text-transparent text-xs h-max line-clamp-1 sm:line-clamp-3 mt-3 mb-2">
                <span className="bg-purple-950 rounded-full h-max">LOADING LOADING</span>
                <span className="bg-purple-950 rounded-full h-max ml-2"> LOADING</span>
                <span className="bg-purple-950 rounded-full h-max ml-2"> LOADING</span>
                <span className="bg-purple-950 rounded-full h-max ml-2"> LOADING</span>
            </div>
            <div className="text-transparent text-xs h-max line-clamp-1 sm:line-clamp-3">
                <span className="bg-purple-950 rounded-full h-max">LOADING LOADING LOADING</span>
            </div>

        </section>
    </div>
}

export function CardFallBack(): JSX.Element {
    return (
        <div className={`grid card grid-cols-[38vw] grid-rows-[38vw_116px] sm:grid-cols-[25vw] lg:grid-cols-[240px] sm:grid-rows-[25vw_116px] lg:grid-rows-[240px_116px] w-max sm:w-[25vw] lg:w-[240px] h-max overflow-hidden lg:h-[375px] gap-2 lg:gap-4 rounded-2xl animate-pulse`}>
            <div className="rounded-2xl object-cover w-[38vw] h-[38vw] sm:w-[25vw] sm:h-[25vw] lg:w-[240px] lg:h-[240px] bg-secondary-no-gr"></div>

            <section className="">
                <div className="text-[18px] sm:text-[20px] font-medium text-transparent bg-purple-950 rounded-full h-max mb-2">
                    LOADING LOADING
                </div>

                <ul className="sm:flex text-transparent space-x-0 sm:space-x-2 text-[10px] sm:text-xs mb-[6px] sm:my-1">
                    <li className="flex items-center">
                        <span className="icon-Author small-icon text-purple-950 mr-1"></span>
                        <span className="bg-purple-950 rounded-full h-max">LOADING</span>
                    </li>
                    <li className="flex">
                        <span className="icon-Access-time small-icon text-purple-950 mr-1"></span>
                        <span className="bg-purple-950 rounded-full h-max">20 December</span>
                        <span className="bg-purple-950 rounded-full h-max ml-2">2024</span>

                    </li>
                </ul>

                <div className="text-transparent text-[10px] flex flex-wrap gap-1 overflow-hidden mt-2">
                    <div className="bg-purple-950 rounded-full h-max">LOADING LOADING LOADING</div>
                    <div className="bg-purple-950 rounded-full h-max">LOADING LOADING</div>
                    <div className="bg-purple-950 rounded-full h-max">LOADING</div>
                    <div className="bg-purple-950 rounded-full h-max">LOADING LOADING LOADING LOADING</div>
                    <div className="bg-purple-950 rounded-full h-max">LOADING LOADING LOADING LOADING</div>
                </div>
            </section>
        </div>
    );
}

export default function MainFallBack(): JSX.Element {
    const loadingArray = [
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category",
        "Category"
    ]
    return (
        <div className="container max-w-[1280px] h-max sm:mx-auto pt-9">
            <Helmet>
                <title>Loading</title>
            </Helmet>
            <div className="grid grid-banner w-full max-w-[1080px] px-6 sm:px-0 sm:mx-auto">
                <h2 className="text-primary banner-title-1">Feature</h2>
                <h2 className="text-primary banner-title-2">Most likes</h2>

                <FallBackBigCard />

                <section className="grid grid-flow-row gap-4 max-h-[740px] lg:flex lg:flex-col overflow-y-scroll custom-sb overflow-x-hidden lg:gap-[15px] banner-card-list">
                    <FallBackSmallCard />
                    <FallBackSmallCard />
                    <FallBackSmallCard />
                    <FallBackSmallCard />
                </section>
                <h2 className="text-primary category-title">Categories</h2>
                {/* <section className="flex h-[360px] w-full overflow-x-scroll overflow-y-hidden custom-sb category-list gap-x-5 sm:gap-x-6"> */}
                <section className="overflow-x-hidden h-[360px] category-list gap-x-5 sm:gap-x-6 animate-pulse">
                    <div className="w-max flex gap-4 scroll-right mb-5">
                        {loadingArray.map((category, index) => {
                            return <p key={index} className="text-[50px] bg-secondary-no-gr rounded-full h-max text-transparent font-bold">{category}</p>
                        })}
                    </div>
                    <div className="w-max flex gap-4 scroll-left mb-5">
                        {loadingArray.map((category, index) => {
                            return <p key={index} className="text-[50px] bg-secondary-no-gr rounded-full h-max text-transparent font-bold">{category}</p>
                        })}
                    </div>
                    <div className="w-max flex gap-4 scroll-right mb-5">
                        {loadingArray.map((category, index) => {
                            return <p key={index} className="text-[50px] bg-secondary-no-gr rounded-full h-max text-transparent font-bold">{category}</p>
                        })}
                    </div>
                    <div className="w-max flex gap-4 scroll-left">
                        {loadingArray.map((category, index) => {
                            return <p key={index} className="text-[50px] bg-secondary-no-gr rounded-full h-max text-transparent font-bold">{category}</p>
                        })}
                    </div>
                </section>
                <h2 className="text-primary banner-title-3">Latests</h2>

                <section className="grid min-[1080px]:grid-cols-4 min-[1080px]:place-items-start min-[1080px]:gap-[24px] gap-[12px] sm:grid-cols-3 sm:place-items-start grid-cols-2 banner-card-cols">
                    <CardFallBack />
                    <CardFallBack />
                    <CardFallBack />
                    <CardFallBack />
                    <CardFallBack />
                    <CardFallBack />
                    <CardFallBack />
                    <CardFallBack />
                </section>
            </div>
        </div>
    );
}