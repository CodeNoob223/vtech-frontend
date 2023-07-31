import axios from "axios";
import { updateNotification } from "../features/pageNotification/pageNotificationSlice";
import store from "../app/store";

export async function getRequest<T>(api: string) : Promise<{
  success: boolean,
  data: T,
  message: string
}>;

export async function getRequest<T>(api: string, authToken: string) : Promise<{
  success: boolean,
  data: T,
  message: string
}>;

export async function getRequest<T>(api: string, authToken: string , additionalHeader : object, justRes : false) : Promise<{
  success: boolean,
  data: T,
  message: string
}>;

export async function getRequest<T>(api: string, authToken: string , additionalHeader : object, justRes : true) : Promise<any>;

export async function getRequest<T>(api: string, authToken: string = "", additionalHeader : object = {}, justRes: boolean = false) {
  try {
    const res = await axios.get(api, {
      headers: {
        "auth-token": authToken || "",
        ...additionalHeader
      }
    });

    if (justRes) return res.data as T;

    return {
      success: res.data.success as boolean,
      data: res.data.data as T,
      message: res.data.message as string
    };
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      store.dispatch(updateNotification({ type: "bg-error", show: true, message }));
      return {
        message: "Api call failed!"
      }
    } else if (error.request) {
      store.dispatch(updateNotification({ type: "bg-error", show: true, message: error.request }));
      
      return {
        message: "Api call failed!"
      }
    } else {
      store.dispatch(updateNotification({ type: "bg-error", show: true, message: error.message }));
      
      return {
        message: "Api call failed!"
      }
    }
  };
}

export async function postRequest<T>(api: string, authToken: string, postData: object) : Promise<{
  success: boolean,
  data: T,
  message: string
}>;

export async function postRequest<T>(api: string, authToken: string, postData: object, hasFile: boolean) : Promise<{
  success: boolean,
  data: T,
  message: string
}>;

export async function postRequest<T>(api: string, authToken: string, postData: object, hasFile: boolean, justRes : false) : Promise<{
  success: boolean,
  data: T,
  message: string
}>;

export async function postRequest<T>(api: string, authToken: string, postData: object, hasFile: boolean, justRes : true) : Promise<T>;

export async function postRequest<T>(api: string, authToken: string = "", postData: object, hasFile: boolean = false, justRes: boolean = false) {
  let res;
  try {
    if (hasFile) {
      res = await axios.post(api, postData, {
        headers: {
          "auth-token": authToken || "",
          "Content-Type": "multipart/form-data"
        }
      });
    } else {
      res = await axios.post(api, postData, {
        headers: {
          "auth-token": authToken || ""
        }
      });
    }

    if (justRes) {
      return res.data as T;
    } else {
      return {
        success: res.data.success as boolean,
        data: res.data.data as T,
        message: res.data.message as string
      };
    }
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      store.dispatch(updateNotification({ type: "bg-error", show: true, message }));
      return {
        message: "Api call failed!"
      }
    } else if (error.request) {
      store.dispatch(updateNotification({ type: "bg-error", show: true, message: error.request }));
      return {
        message: "Api call failed!"
      }
    } else {
      store.dispatch(updateNotification({ type: "bg-error", show: true, message: error.message }));
      
      return {
        message: "Api call failed!"
      }
    }
  };
}

export async function putRequest<T>(api: string, authToken: string, postData: object) : Promise<{
  success: boolean,
  data: T,
  message: string
}>;

export async function putRequest<T>(api: string, authToken: string, postData: object, hasFile: boolean) : Promise<{
  success: boolean,
  data: T,
  message: string
}>;

export async function putRequest<T>(api: string, authToken: string, postData: object, hasFile: boolean, justRes : false) : Promise<{
  success: boolean,
  data: T,
  message: string
}>;

export async function putRequest<T>(api: string, authToken: string, postData: object, hasFile: boolean, justRes : true) : Promise<any>;

export async function putRequest<T>(api: string, authToken: string = "", data: object, hasFile: boolean = false, justRes : boolean = false) {
  let res;
  try {
    if (hasFile) {
      res = await axios.put(api, data, {
        headers: {
          "auth-token": authToken || "",
          "Content-Type": "multipart/form-data"
        }
      });
    } else {
      res = await axios.put(api, data, {
        headers: {
          "auth-token": authToken || ""
        }
      });
    }

    if (justRes) return res.data as T;

    return {
      success: res.data.success as boolean,
      data: res.data.data as T,
      message: res.data.message as string
    };
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      store.dispatch(updateNotification({ type: "bg-error", show: true, message }));
      return {
        message: "Api call failed!"
      }
    } else if (error.request) {
      store.dispatch(updateNotification({ type: "bg-error", show: true, message: error.request }));
      return {
        message: "Api call failed!"
      }
    } else {
      store.dispatch(updateNotification({ type: "bg-error", show: true, message: error.message }));
      
      return {
        message: "Api call failed!"
      }
    }
  };
}

export async function deleteRequest<T>(api: string, authToken: string = "") {
  try {
    const res = await axios.delete(api, {
      headers: {
        "auth-token": authToken || ""
      }
    });

    return {
      success: res.data.success as boolean,
      data: res.data.data as T,
      message: res.data.message as string
    };
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      store.dispatch(updateNotification({ type: "bg-error", show: true, message }));
      return {
        message: "Api call failed!"
      }
    } else if (error.request) {
      store.dispatch(updateNotification({ type: "bg-error", show: true, message: error.request }));
      return {
        message: "Api call failed!"
      }
    } else {
      store.dispatch(updateNotification({ type: "bg-error", show: true, message: error.message }));
      
      return {
        message: "Api call failed!"
      }
    }
  };
}