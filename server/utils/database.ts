import { Timestamp, getFirestore } from "firebase-admin/firestore";
import { FormResponse } from "~/types";

const db = getFirestore();

async function createDocument<T extends {}>(collectionPath: string[], data: T) {
  const res = await db
    .doc(collectionPath.join("/"))
    .create({ ...data, createdAt: Timestamp.now() });
  if (!res.writeTime) {
    throw createError({
      statusCode: 500,
      message: "Failed to create document",
      statusMessage: "Internal Server Error",
    });
  }
  return {
    statusCode: 201,
    status: true,
    message: "Document created successfully",
  };
}

async function updateDocument<T extends {}>(collectionPath: string[], data: T) {
  const res = await db
    .doc(collectionPath.join("/"))
    .update({ ...data, updatedAt: Timestamp.now() });
  if (!res.writeTime) {
    throw createError({
      statusCode: 500,
      message: "Failed to update document",
      statusMessage: "Internal Server Error",
    });
  }
  return {
    statusCode: 200,
    status: true,
    message: "Document updated successfully",
  };
}

async function getDocument<T extends {}>(collectionPath: string[]) {
  const res = await db.doc(collectionPath.join("/")).get();
  if (res.exists) {
    return res.data() as T;
  }
  throw createError({
    statusCode: 404,
    message: "Document not found",
    statusMessage: "Not Found",
  });
}

async function deleteDocument(collectionPath: string[]) {
  const res = await db.doc(collectionPath.join("/")).delete();
  if (!res.writeTime) {
    throw createError({
      statusCode: 500,
      message: "Failed to delete document",
      statusMessage: "Internal Server Error",
    });
  }
  return {
    statusCode: 200,
    status: true,
    message: "Document deleted successfully",
  };
}

async function getCollection<T extends {}>(collectionPath: string[]) {
  const res = await db.collection(collectionPath.join("/")).get();
  const data: T[] = [];
  res.forEach((doc) => {
    data.push(doc.data() as T);
  });
  return data;
}

async function deleteCollection(collectionPath: string[]) {
  const res = await db.collection(collectionPath.join("/")).listDocuments();
  for (const doc of res) {
    await doc.delete();
  }
  return {
    statusCode: 200,
    status: true,
    message: "Collection deleted successfully",
  };
}

// For Profile
async function createProfile<T extends {}>(uId: string, data: T) {
  await createDocument([uId, "profile"], data);
  return getProfile(uId);
}

async function getProfile<T extends {}>(uId: string) {
  const data = await getDocument<T>([uId, "profile"]);
  return data;
}

async function updateProfile<T extends {}>(uId: string, data: T) {
  await getProfile<{}>(uId);
  await updateDocument([uId, "profile"], data);
  return getProfile(uId);
}

async function deleteProfile<T extends {}>(uId: string) {
  await getProfile<T>(uId);
  await deleteDocument([uId, "profile"]);
  return {
    statusCode: 200,
    status: true,
    message: "Profile deleted successfully",
  };
}

// For Response
async function createResponse<T extends {}>(
  uId: string,
  fId: string,
  responseId: string,
  data: T
) {
  await getProfile(uId);
  await createDocument([uId, "responses", fId, responseId], data);
  return getResponse(uId, fId, responseId);
}

async function getResponse<T extends {}>(
  uId: string,
  fId: string,
  responseId: string
) {
  await getProfile(uId);
  return getDocument<T>([uId, "responses", fId, responseId]);
}

async function getResponses<
  T extends {
    createdAt?: Date;
    updatedAt?: Date;
  }
>(uId: string, fId: string) {
  await getProfile(uId);
  const data = await getCollection<T>([uId, "responses", fId]);
  data.sort((a, b) => {
    return (a.createdAt ?? 0) > (b.createdAt ?? 0) ? -1 : 1;
  });

  return data;
}

async function deleteResponses(uId: string, fId: string) {
  await getProfile(uId);
  await deleteCollection([uId, "responses", fId]);
  return {
    statusCode: 200,
    status: true,
    message: "Response deleted successfully",
  };
}

// For Form
async function createForm<T extends {}>(
  uId: string,
  fId: string,
  data: T
) {
  await getProfile(uId);
  await createDocument([uId, "forms", "forms", fId], data);
  return getForm<FormResponse>(uId, fId);
}

async function getForm<T extends {}>(uId: string, fId: string) {
  await getProfile(uId);
  return getDocument<T>([uId, "forms", "forms", fId]);
}

async function getForms<
  T extends {
    createdAt?: Date;
    updatedAt?: Date;
  }
>(uId: string) {
  await getProfile(uId);

  const data = await getCollection<T>([uId, "forms", "forms"]);

  data.sort((a, b) => {
    return (a.createdAt ?? 0) > (b.createdAt ?? 0) ? -1 : 1;
  });

  return data as Omit<T, "createdAt" | "updatedAt">[];
}

async function updateForm<T extends {}>(
  uId: string,
  fId: string,
  data: T
) {
  await getProfile(uId);
  await updateDocument([uId, "forms", "forms", fId], data);
  return getForm<FormResponse>(uId, fId);
}

async function deleteForm(uId: string, fId: string) {
  await getProfile(uId);
  await deleteDocument([uId, "forms", "forms", fId]);
  await deleteResponses(uId, fId);
  return {
    statusCode: 200,
    status: true,
    message: "Form deleted successfully",
  };
}

export {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  createResponse,
  getResponses,
  getResponse,
  createForm,
  getForms,
  getForm,
  updateForm,
  deleteForm,
};
