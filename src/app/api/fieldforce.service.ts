import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Platform, LoadingController } from '@ionic/angular';
import { tokenKey } from '@angular/core/src/view';
// import * as aws from "aws-sdk/";
// import * as S3 from 'aws-sdk/clients/s3';

interface myData {
  data: object;
}
@Injectable({
  providedIn: 'root'
})
export class FieldforceService {
  _title: any;
  _memberid: any;
  location: any;
  link: any;
  link2: any;
  token: any = '166d35eabca17c1089e4662042cf3bb103a28d8d';
  headersToken = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.token });

  set getTitle(value: any) {
    this._title = value;
  }

  get getTitle(): any {
    return this._title;
  }

  set getMemberID(value: any) {
    this._memberid = value;
  }

  get getMemberID(): any {
    return this._memberid;
  }

  _selectedProvince: any;
  set selectedProvince(value: any) {
    this._selectedProvince = value;
  }

  get selectedProvince(): any {
    return this._selectedProvince;
  }

  _selectedCity: any;
  set selectedCity(value: any) {
    this._selectedCity = value;
  }

  get selectedCity(): any {
    return this._selectedCity;
  }




  locationList: any;
  provinceList: any = [];
  cityList: any = [];
  loading: any;
  constructor(
    public plt: Platform,
    private geolocation: Geolocation,
    private http: HTTP,
    private httpclient: HttpClient,
    public loadingCtrl: LoadingController

  ) {
    this.link2 = "http://54.169.232.8:8004";
    this.link = "https://128.199.228.223:3000"
    // this.link = "http://localhost:3000/"

    this.loadLocations();
    this.sample();
  }

  sample() {
    let reqHeader: HttpHeaders = new HttpHeaders();
    reqHeader = reqHeader.append("Content-Type", "application/json");
    reqHeader = reqHeader.append("Access-Control-Allow-Origin", "*");
    reqHeader = reqHeader.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    reqHeader = reqHeader.append("Authorization", "Token " + this.token);
    console.log(reqHeader);

    if (this.plt.is('mobileweb')) {
      this.httpclient.get('http://54.169.232.8:8004/rewards/products/', { headers: reqHeader }).subscribe((response) => {
        // console.log(response);
        alert(response)
        let data: any;
        data = response;
        console.log(data);
      });
    } else {
      // this.http.get('http://54.169.232.8:8004/rewards/products/', {}, { reqHeader }).then((response) => {
      //   // console.log(response);
      //   alert(response)
      //   let data: any;
      //   data = response;
      //   console.log(data);
      // });
      this.httpclient.get('https://128.199.228.223:3000/api/getDistributor').subscribe(
        data => {
          alert('ok' + JSON.stringify(data));
          // console.log('growersData', data);
        },
        err => {
          alert('oops' + JSON.stringify(err));
        }
      );

      // router.get("/rewards/products/", (req, res, next) => {
      //   let token = "Token 166d35eabca17c1089e4662042cf3bb103a28d8d";
      
      //   request(
      //     {
      //       url: "http://54.169.232.8:8004/rewards/products/",
      //       method: "GET",
      //       json: true,
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: token
      //       }
      //     },
      //     function (error, response, body) {
      //       res.json(body);
      //     }
      //   );
      // });
    }
  }

  // uploadfile(file) {

  //   let self = this;
  //   const bucket = new aws.S3(
  //     {
  //       accessKeyId: 'AKIAIUEC2WQ5Q52TYFBA',
  //       secretAccessKey: 'aK6RFPLfEsdkx6w0vRNzVYhCRwrS34ZeKqxw',
  //       region: 'ap-east-1'
  //     }
  //   );

  //   const params = {
  //     Bucket: 'syngenta-images',
  //     Key: "Syngenta-" + Math.round(new Date().getTime() / 1000) + "." + file.name.split(".")[1],
  //     Body: file
  //   };

  //   bucket.upload(params, function (err, data) {
  //     if (err) {
  //       console.log('There was an error uploading your file: ', err);
  //       // self.save();
  //       return false;

  //     } else {
  //       console.log('Successfully uploaded file.', data);
  //       let imgPath = data;
  //       alert(JSON.stringify(imgPath))
  //       // self.retailerDetails.photo = imgPath.Location;
  //       // self.save();
  //       return true;
  //     }


  //   });
  // }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: '',
    });
    await this.loading.present();
  }

  async loadLocations() {
    if (this.plt.is('mobileweb')) {
      return new Promise(resolve => {
        this.httpclient.get(this.link + '/region', {}).subscribe((response) => {
          // console.log(response);
          let locations: any;
          locations = response;
          // console.log(locations);
          resolve(locations);
        });
      });
    } else {

      return new Promise(resolve => {
        this.http.get(this.link2 + '/static/locations.json', {}, {}).then((response) => {
          // console.log(response);
          let locations: any;
          locations = response;
          // console.log(locations);
          resolve(locations);
        });

      });
    }
  }

  login(info) {
    console.log(info);
    let data: any = {};
    data = {
      username: info.username,
      password: info.password,
    }
    // data = {
    //   username: "jim2019",
    //   password: "icanseeyou",
    // }

    if (this.plt.is('mobileweb')) {
      return new Promise(resolve => {
        this.httpclient.post(this.link2 + '/auth/token/login/', data).subscribe((response) => {
          // console.log(response);
          let res;
          res = response;
          if (res.auth_token) {
            this.token = res.auth_token;
            localStorage.setItem('token', res.auth_token);
            // this.getProducts();

            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    } else {
      return new Promise(resolve => {
        // alert(JSON.stringify(data))
        this.http.post(this.link2 + '/auth/token/login/', data, {}).then((response) => {
          // alert(JSON.stringify(JSON.parse(response.data)));
          console.log(response)
          let res;
          res = JSON.parse(response.data);
          if (res.auth_token) {
            this.token = res.auth_token;
            localStorage.setItem('token', res.auth_token);
            resolve(true);
          } else {
            resolve(false);
          }
        }).catch(error => {
          // alert(JSON.stringify(error))
          console.log(error);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });

      })
    }
  }

  getMessages() {
    if (this.plt.is('mobileweb')) {
      return new Promise(resolve => {
        this.httpclient.get(this.link + '/get/message/fieldforce/').subscribe((response) => {
          // console.log(response);
          // alert(response);

          resolve(response)
        });
      });
    } else {
      return new Promise(resolve => {
        this.http.get(this.link + '/get/message/fieldforce/', {}, {}).then((response) => {
          console.log(response);

          // alert(JSON.stringify(JSON.parse(response.data)));
        }).catch(error => {
          // alert(JSON.stringify(error))
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });

      });
    }
  }

  getProducts() {
    let user = {
      "username": "jim2019",
      "password": "icanseeyou"
    }
    let wew = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.token });
    console.log(wew)
    if (this.plt.is('mobileweb')) {
      return new Promise(resolve => {
        this.http.get(this.link2 + '/rewards/products/', { user }, { wew }).then((response) => {
          // console.log(response);
          alert(JSON.stringify(response));

          resolve(response)
        });
      });
    } else {
      return new Promise(resolve => {
        this.http.get(this.link2 + '/rewards/products/', { parameters: user }, { headers: wew }).then((response) => {
          // console.log(response);
          alert(JSON.stringify(response));

          resolve(response)
        }).catch(error => {
          // alert(JSON.stringify(error))
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });

      });
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('token');
  }

  log(message: string) {
    console.log(message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getLocation() {
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   console.log(resp.coords);
    //   // this.location = resp.coords.latitude + '/' + resp.coords.longitude;
    //   // resp.coords.latitude
    //   // resp.coords.longitude
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });

    this.geolocation.watchPosition().subscribe((data) => {
      console.log(data.coords);
      // this.location = data.coords.latitude + '/' + data.coords.longitude;
      this.location = {
        latlng: data.coords.latitude + '/' + data.coords.longitude,
        lat: data.coords.latitude,
        lon: data.coords.longitude
      }
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }
}
