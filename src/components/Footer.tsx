export default function Footer(): JSX.Element {
  return (
    <footer className="p-[24px] mx-auto gap-4 bg-secondary-no-gr h-max mt-10">
      <div className="w-full grid sm:grid-cols-4 grid-cols-2 h-max place-items-start gap-4">
        <ul>
          <li className="text-white01 font-bold text-xl mb-1 text-primary">
            Media
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Facebook
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Instargram
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Twitter
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Github
            </a>
          </li>
        </ul>
        <ul>
          <li className="text-white01 font-bold text-xl mb-1 text-primary">
            Support
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Account
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Your posts
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Certification
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Bug report
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Writing
            </a>
          </li>
        </ul>
        <ul>
          <li className="text-white01 font-bold text-xl mb-1 text-primary">
            Company
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              About us
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Terms of Use
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/" target="_blank">
              Privacy Notice
            </a>
          </li>
        </ul>
        <ul>
          <li className="text-white01 font-bold text-xl mb-1 text-primary">
            Blogs
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/latests" target="_blank">
              Latests
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/mostlikes" target="_blank">
              Most likes
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/mostviews" target="_blank">
              Most views
            </a>
          </li>
          <li className="text-white03 hover:text-slate-200 transition-all">
            <a href="/certifiedblogs" target="_blank">
              Certified authors
            </a>
          </li>
        </ul>
      </div>
      <div className="mt-6">
        <div className="h-[1px] w-full bg-white03 mb-2"></div>
        <p className="text-white03 text-xs">Copyright © 2004 - 2023 Vtech LLC. All rights reserved</p>
      </div>
    </footer>
  );
}