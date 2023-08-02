export { };

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  type Category = {
    _id: string, //Is also its name
    imageUrl: string
  }

  type BlogAppHeader = {
    openSideBar : React.Dispatch<React.SetStateAction<boolean>>
  }

  type Blog = {
    _id: string,
    title: string,
    coverImage: string,
    content: string,
    description: string, //Summary of the content
    author: User, //Author's id / Name / Profile info
    time: string, //CreateAt | "Month Date, Year" 

    likedBy: string[], //Users who likes
    dislikedBy: string[]

    likesCount: number, //Likes count
    dislikesCount: number,
    commentsCount: number,
    viewsCount: number,

    categories: Category[],
    tags: string[],

    imageFile?: File,
    attachedImages?: attachedImages[],

    comments: Comment[]
  };

  type Comment = {
    _id: string,
    content: string,
    author: User,
    createAt: string,
    likesCount: number,
    dislikesCount: number,
    likedBy: User[] | string[],
    dislikedBy: User[] | string[]
  }

  type Category = {
    _id?: string,
    name: string
  }

  type attachedImages = {
    _id?: string,
    blogId?: string,
    fileName: string,
    uploader?: string,
    imageUrl?: string
  }

  type PageNotification = {
    id?: string,
    type: "bg-error" | "bg-success" | "bg-normal" | "bg-warning",
    show: boolean,
    message?: string
  }

  type SearchResult<T> = {
    isFocus: boolean,
    results: T[]
  }
  
  type AppCard = {
    _id: string,
    title: string,
    likesCount: number,
    time: string | "Month Date, Year",
    authorName: string, //Author's name
    viewsCount: number,
    description: string,
    coverImage?: string,
    blogUrl: string,
    myStyles?: string,
    index?: number
  };

  type AppCategoryCard = {
    title: string,
    url: string,
    coverImage?: string
  }

  type AppTextInput = {
    id?: string,
    name: string,
    type: "text" | "password",
    placeholder: string,
    value?: string | number,
    myStyles: string,
    error?: string,
    handleChange: React.ChangeEventHandler,
    toggleType?: boolean
  };

  type AppFileInput = {
    id?: string,
    name: string,
    accept: string,
    value?: File,
    myStyles?: string,
    error?: string,
    handleChange: (file: File, imageWidth: number, imageHeight: number, tempUrl: string) => void,
    inputTitle?: string
  };

  type AppCheckBox = {
    id?: string,
    name: string,
    checked?: boolean,
    myStyles?: string,
    handleChange: React.ChangeEventHandler,
    content: string,
    link?: string,
    href?: string
  }

  type BlogComment = {
    _id: string,
    content: string,
    author: User,
    createAt: string,
    likesCount?: number,
    dislikesCount?: number,

    likedBy: string[],
    dislikedBy: string[],
    
    handleDelete: () => void
    handleVote: (id: string, method: string) => void
  };

  type Option = {
    name: string,
    isSelect: boolean
  };

  type User = {
    _id?: string,
    name: string,
    avatar: UserAvatar,
    profession: string,
    bookmark?: string[], //Array of ids
    email?: string,
    likesCount?: number,
    followersCount?: number,
    postsCount?: number,
    dislikesCount?: number,
    follows?: string[], //Array of ids
    isAdmin: boolean,
    date?: string,
    isValidated?: boolean,
    isCertified?: boolean,
    about?: string,
    contacts?: Contact[],
    notifications: UserNotification[],

    avatarFile?: File
  };

  type UserAvatar = {
    url: string,
    top: number,
    left: number,
  };

  type UserNotification = {
    _id: string,
    title: string,
    content: string,
    url: string,
    icon: string
  };

  type Contact = {
    _id?: string,
    media: ContactMedia,
    url: string,
    content: string,
    receiver?: string
  }

  type ContactMedia = {
    _id: string,
    name: string,
    icon: string,
    placeholder: string,
    regex: string
  }
}
