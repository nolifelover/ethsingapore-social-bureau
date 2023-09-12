import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "src/environments/environment";

@Pipe({
  name: "imageUri",
})
export class ImageUriPipe implements PipeTransform {
  transform(path: string) {
    const encodePath = path
      .toString()
      .replaceAll("/", "%2F")
      .replaceAll(" ", "%20");
    const uri = environment.firebasestorageUrl.replace("<image>", encodePath);
    return uri;
  }
}
