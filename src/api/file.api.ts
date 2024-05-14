import { FileForm, FileInfo, FileSearchForm } from "@/types/files";
import { ResponseData, http } from "./request";

export const getFileList = (fileSearchForm?: FileSearchForm) => {
  return http.get<ResponseData<FileInfo[]>>("/file/query", {
    params: { form: fileSearchForm ?? {} },
  });
};

export const addFileData = (fileForm: FileForm) => {
  return http.post("/file/insert", fileForm);
};

export const deleteFilesByIds = (noList: number[]) => {
  return http.delete<ResponseData<Object>>("/file/delete", {
    params: { noList },
  });
};

export const updateFileByNo = (no: number, data: FileForm) => {
  return http.post<ResponseData<Object>>(
    "/file/update",
    Object.assign(data, { no })
  );
};
