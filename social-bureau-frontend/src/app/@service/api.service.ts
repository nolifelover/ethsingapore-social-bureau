import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  CommonAuthResponse,
  User,
  UserProfileInputType,
} from "../@type/auth.type";
import {
  ReportDetail,
  ReportInputType,
  ReportPayloadWithPageInfo,
} from "../@type/report.type";
import { ReportCommentInputType } from "../@type/comment.type";
import { HistoryPayloadWithPageInfo } from "../@type/history.type";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private endpoint = environment.apiUrl;
  constructor(private http: HttpClient) { }

  singinWithPublicAddress(publicAddress: string) {
    const url = `${this.endpoint}/auth/singin/public-address`;
    return this.http
      .post<CommonAuthResponse>(url, {
        publicAddress,
      })
      .toPromise();
  }

  authenWithPublicAddress(publicAddress: string, signature: string) {
    const url = `${this.endpoint}/auth/using/public-address`;
    return this.http
      .post<CommonAuthResponse>(url, {
        publicAddress,
        signature,
      })
      .toPromise();
  }

  getUserInfo() {
    const url = `${this.endpoint}/users/me`;
    return this.http.get<User>(url).toPromise();
  }

  getCrimeReports(param?: string, uid?: string) {
    const options = !!uid
      ? {
        headers: {
          userid: uid,
        },
      }
      : {};
    const url = `${this.endpoint}/crimes${!!param ? param : ""}`;
    return this.http.get<ReportPayloadWithPageInfo>(url, options).toPromise();
  }

  getCrimeReportById(crimeId: string, uid?: string) {
    const url = `${this.endpoint}/crimes/${crimeId}`;
    const options = !!uid
      ? {
        headers: {
          userid: uid,
        },
      }
      : {};
    return this.http.get<ReportDetail>(url, options).toPromise();
  }

  postCrimeReport(report: ReportInputType) {
    const url = `${this.endpoint}/crimes`;
    return this.http.post<void>(url, report).toPromise();
  }

  uploadEvidenceImages(images: File[]) {
    const url = `${this.endpoint}/upload-images/crime`;
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    return this.http
      .post<string[]>(url, formData, {
        headers: {
          Accept: "application/json",
        },
      })
      .toPromise();
  }

  uploadCommentImages(images: File[]) {
    const url = `${this.endpoint}/upload-images/comment`;
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    return this.http
      .post<string[]>(url, formData, {
        headers: {
          Accept: "application/json",
        },
      })
      .toPromise();
  }

  deleteImages(imagePath: string) {
    const url = `${this.endpoint}/upload-images`;
    return this.http.delete<void>(url, { body: { imagePath } }).toPromise();
  }

  voteCrimeReport(crimeId: string, type: "UPVOTE" | "DOWNVOTE") {
    const url = `${this.endpoint}/votes`;
    return this.http.post<void>(url, { crimeId, type }).toPromise();
  }

  postCrimeReportComment(comment: ReportCommentInputType) {
    const url = `${this.endpoint}/comments`;
    return this.http.post<void>(url, comment).toPromise();
  }

  // getUserPoint() {
  //   const url = `${this.endpoint}/user-points/my-point`;
  //   return this.http.get<any>(url).toPromise();
  // }

  updateUserProfile(uid: string, userInfo: UserProfileInputType) {
    const url = `${this.endpoint}/users/${uid}`;
    return this.http.patch<void>(url, userInfo).toPromise();
  }

  uploadProfileImages(images: File[]) {
    const url = `${this.endpoint}/upload-images/profile`;
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("profileImage", image);
    });

    return this.http
      .post<string>(url, formData, {
        headers: {
          Accept: "application/json",
        },
      })
      .toPromise();
  }

  createUserPoint(uid?: string) {
    const url = `${this.endpoint}/user-points`;
    return this.http.post<any>(url, { uid: uid, point: 0 }).toPromise();
  }

  updateUserPoint(id?: string, point?: number) {
    const url = `${this.endpoint}/user-points/${id}`;
    return this.http.patch<any>(url, { point: point }).toPromise();
  }

  createUserReportPoint(uid?: string, category?: string, crimeId?: string, point?: number) {
    const url = `${this.endpoint}/user-report-points`;
    return this.http
      .post<any>(url, {
        uid: uid,
        crimeId: crimeId,
        category: category,
        point: point,
        isEnd: 0,
      })
      .toPromise();
  }

  updateUserReportPoint(
    id?: string,
    category?: string,
    crimeId?: string,
    point?: number,
    isEnd?: number
  ) {
    const url = `${this.endpoint}/user-report-points/${id}`;
    return this.http
      .patch<any>(url, {
        crimeId: crimeId,
        category: category,
        point: point,
        isEnd: isEnd,
      })
      .toPromise();
  }

  getUserReportPoint(crimeId: string, category: string) {
    const url = `${this.endpoint}/user-report-points/my-point/${crimeId}/${category}`;
    return this.http.get<any>(url).toPromise();
  }

  getSumUserReportPoint() {
    const url = `${this.endpoint}/user-report-points/my-point`;
    return this.http.get<any>(url).toPromise();
  }

  getUserHistory(param?: string) {
    const url = `${this.endpoint}/user-histories${!!param ? param : ""}`;
    return this.http.get<HistoryPayloadWithPageInfo>(url).toPromise();
  }

  getCrimeReportsByScamType(param?: string, uid?: string) {
    const options = !!uid
      ? {
        headers: {
          userid: uid,
        },
      }
      : {};
    const url = `${this.endpoint}/crimes/scam-type${!!param ? param : ""}`;
    return this.http.get<ReportPayloadWithPageInfo>(url, options).toPromise();
  }

  deleteCrimeReport(id?: string) {
    const url = `${this.endpoint}/crimes/${id}`;
    return this.http.delete<ReportPayloadWithPageInfo>(url).toPromise();
  }
}
