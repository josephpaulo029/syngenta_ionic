import { FilterProductsUsertype } from './../filter.pipe';
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
import { Platform, LoadingController, ToastController, AlertController } from '@ionic/angular';
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
  token: any = 'bc5bd1d42315d7c9081f74121589b1c0aacd61e2';
  headers = new HttpHeaders()
    .set("Content-Type", "application/json")

  headersToken = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Authorization", "Token " + localStorage.getItem('token'))

  _cart: any;
  set getCartData(value: any) {
    this._cart = value;
  }
  get getCartData(): any {
    return this._cart;
  }
  _title: any;
  set getTitle(value: any) {
    this._title = value;
  }
  get getTitle(): any {
    return this._title;
  }
  _memberid: any;
  set getMemberID(value: any) {
    this._memberid = value;
  }
  get getMemberID(): any {
    return this._memberid;
  }
  _memberdata: any;
  set getMemberData(value: any) {
    this._memberdata = value;
  }
  get getMemberData(): any {
    return this._memberdata;
  }
  _product: any;
  set chosenProduct(value: any) {
    this._product = value;
  }
  get chosenProduct(): any {
    return this._product;
  }
  _retailer: any;
  set chosenRetailer(value: any) {
    this._retailer = value;
  }
  get chosenRetailer(): any {
    return this._retailer;
  }
  location: any;
  link: any;
  dev: any;
  locationList: any;
  provinceList: any = [];
  cityList: any = [];
  loading: any = new LoadingController;
  alert: any;
  productList: any;
  retailerList: any;
  growerList: any;
  ngrok: any;
  localhosts: any;
  fieldforceData: any;

  constructor(
    public plt: Platform,
    private geolocation: Geolocation,
    private http: HTTP,
    private httpclient: HttpClient,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
  ) {
    this.dev = "http://54.169.232.8:8004";
    // this.link = "http://240684b9.ngrok.io"
    this.link = "https://128.199.228.223:3000"
    this.ngrok = "http://ac191fe2.ngrok.io"
    this.localhosts = "http://localhost:3000"

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
  async presentAlert(msg) {
    this.alert = await this.alertController.create({
      header: 'Warning',
      // subHeader: 'Subtitle',
      message: msg,
      buttons: ['OK']
    });
    this.alert.present();
  }

  async presentSuccess(msg) {
    this.alert = await this.alertController.create({
      header: 'Success',
      // subHeader: 'Subtitle',
      message: msg,
      buttons: ['OK']
    });
    this.alert.present();
  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
    });
    return await this.loading.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "dark",
      // showCloseButton: true,
      position: 'bottom',
      cssClass: "toastStyle",
      // closeButtonText: 'Done'
    });
    toast.present();
  }

  getMembershipStatus(tier) {
    switch (tier) {
      case 1:
        return 'Classic'
      case 2:
        return 'Premium'
      case 3:
        return 'Platinum'

      default:
        break;
    }
  }

  async login(info) {
    await this.presentLoading('Logging In...')
    let data;
    data = {
      username: "jim2019",
      password: "icanseeyou",
    }

    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/auth/token/login/', info).subscribe(
        response => {
          let res;
          res = response;
          if (res.auth_token) {
            this.token = res.auth_token;
            localStorage.setItem('token', res.auth_token);

            this.httpclient.post(this.link + '/api/ios/users/fieldforces/me/' + this.token, { headers: this.headers }).subscribe(
              res => {
                console.log(res)
                this.fieldforceData = res
                localStorage.setItem('fieldforce', JSON.stringify(this.fieldforceData));
                this.loading.dismiss();

                resolve(true);
              },
              err => {
                this.loading.dismiss();
                alert(JSON.stringify(err));
              }
            );
          } else {
            this.loading.dismiss();
            resolve(false);
          }
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );

    }).catch(err => {
      console.log(err)
    })
  }

  async loadLocations() {
    // await this.presentLoading('');

    this.httpclient.get(this.link + '/api/ios/locations').subscribe(response => {
      this.locationList = response
      // this.loading.dismiss();

      // console.log(this.locationList);
    },
      err => {
        this.loading.dismiss();
        alert(JSON.stringify(err));
      });
  }

  async getMessages() {
    await this.presentLoading('');

    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/messages/fieldforces/', { auth_token: localStorage.getItem('token') }, { headers: this.headers }).subscribe(
        response => {
          // console.log(response);
          // alert(response);
          this.loading.dismiss();


          resolve(response)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        });
    }).catch(err => {
      console.log(err)
    })
  }

  async getProducts() {
    await this.presentLoading('');

    this.httpclient.post(this.link + '/api/ios/rewards/products/', { auth_token: localStorage.getItem('token') }, { headers: this.headers }).subscribe(
      data => {
        this.productList = data;
        console.log(data);

        this.httpclient.post(this.link + '/api/ios/users/retailers/', { auth_token: localStorage.getItem('token') }, { headers: this.headers }).subscribe(
          data => {

            this.retailerList = data;
            console.log(data);

            this.httpclient.post(this.link + '/api/ios/users/growers/', { auth_token: localStorage.getItem('token') }, { headers: this.headers }).subscribe(
              data => {
                this.growerList = data;
                console.log(data);
                this.loading.dismiss();

              },
              err => {
                this.loading.dismiss();
                alert(JSON.stringify(err));
              }
            );
          },
          err => {
            this.loading.dismiss();
            alert(JSON.stringify(err));
          }
        );
      },
      err => {
        this.loading.dismiss();
        alert(JSON.stringify(err));
      }
    );

  }

  async checkMembership(info) {
    // await this.presentLoading('');
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/users/retailers/' + info, { auth_token: localStorage.getItem('token') }, { headers: this.headers }).subscribe(
        data => {
          let res;
          res = data[0];
          console.log(data);
          if (res == undefined) {
            this.httpclient.post(this.link + '/api/ios/users/growers/' + info, { auth_token: localStorage.getItem('token') }, { headers: this.headers }).subscribe(
              data => {
                res = data[0];
                console.log(data);
                // this.loading.dismiss();
                if (res != undefined) {
                  res.type = 'growers'
                  resolve(res)
                } else {
                  resolve(false)
                }
              },
              err => {
                // this.loading.dismiss();
                alert(JSON.stringify(err));
              }
            );
          } else {
            this.loading.dismiss();
            res.type = 'retailers'
            resolve(res)
          }

        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      console.log(err)
    })
  }

  async getRetailerList() {
    // await this.presentLoading('');
    return new Promise(resolve => {

    }).catch(err => {
      console.log(err)
    })
  }

  async getGrowerList() {
    // await this.presentLoading('');
    return new Promise(resolve => {

    }).catch(err => {
      console.log(err)
    })
  }

  async memberidVerification(info) {
    await this.presentLoading('Validating membership id');
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/users/' + info.type + '/' + info.memberid, { auth_token: localStorage.getItem('token') }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          // console.log(data);
          let response;
          response = data
          if (response[0]) {
            resolve(data)
          } else {
            resolve(false)
          }
          // this.retailerList = data;
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      console.log(err)
    })
  }

  async retailerClaim(info) {
    await this.presentLoading('Submitting...');
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/rewards/retailers/claim/' + info.membership, { auth_token: localStorage.getItem('token'), details: info }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          console.log(data);
          resolve(data)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      console.log(err)
    })
  }

  async growerClaim(info) {
    await this.presentLoading('Submitting...');
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/rewards/growers/claim/' + info.membership, { auth_token: localStorage.getItem('token'), details: info }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          console.log(data);
          resolve(data)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      console.log(err)
    })
  }

  async createRetailer(info) {
    // info.retailer.birthdate = "2019-03-06"
    // info.retailer.membership = "7814134079305509"
    await this.presentLoading('Creating new retailer');
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/create/users/retailers/', { auth_token: localStorage.getItem('token'), details: info }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          // console.log(data);
          resolve(data)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      console.log(err)
    })
  }

  async createGrower(info) {
    // info.retailer.birthdate = "2019-03-06"
    // info.retailer.membership = "7814134079305509"
    await this.presentLoading('Creating grower...');
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/create/users/growers/', { auth_token: localStorage.getItem('token'), details: info }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          // console.log(data);
          resolve(data)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      console.log(err)
    })
  }

  async activate(info) {
    let data;
    data = {
      "uid": info.uid,
      "phone_number": info.phone_number
    }
    await this.presentLoading('');
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/activate/' + info.type, { auth_token: localStorage.getItem('token'), details: data }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          // console.log(data);
          resolve(data)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      console.log(err)
    })
  }

  async resendCode(info) {
    let data;
    data = {
      "membership": info.membership,
      "phone_number": info.phone_number
    }
    await this.presentLoading('');
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/users/' + info.type + '/activate/resend/', { auth_token: localStorage.getItem('token'), details: data }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          // console.log(data);
          resolve(data)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      console.log(err)
    })
  }

  async forgotpassword(info) {
    await this.presentLoading('Submitting forgot password request.');
    let data;
    data = {
      "email": info.email,
    }
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/auth/password/reset/', { auth_token: localStorage.getItem('token'), details: data }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          // console.log(data);
          resolve(data)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      console.log(err)
    })
  }

  async checkNumber(info) {
    await this.presentLoading('');
    console.log(info)
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/checkmobile/' + info, { auth_token: localStorage.getItem('token') }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          // console.log(data);
          let res;
          res = data;
          resolve(res)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      this.loading.dismiss();
      console.log(err)
    })
  }

  async verifyLostcard(info) {
    let data;
    data = {
      "phone_number": info.phone_number,
      "membership": info.membership
    }
    await this.presentLoading('');
    console.log(info)
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/users/verify/' + info.type + '/lostcard/', { auth_token: localStorage.getItem('token'), details: data }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          // console.log(data);
          let res;
          res = data;
          resolve(res)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      this.loading.dismiss();
      console.log(err)
    })
  }

  async verifyLostphone(info) {
    let data;
    data = {
      "phone_number": info.phone_number,
      "membership": info.membership,
    }
    await this.presentLoading('');
    console.log(info)
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/users/verify/' + info.type + '/lostphone/', { auth_token: localStorage.getItem('token'), details: data }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          // console.log(data);
          let res;
          res = data;
          resolve(res)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      this.loading.dismiss();
      console.log(err)
    })
  }

  async getReports(info) {
    await this.presentLoading('');
    console.log(info)
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/reports/' + info.type + '/' + info.id, { auth_token: localStorage.getItem('token') }, { headers: this.headers }).subscribe(
        data => {
          this.loading.dismiss();
          // console.log(data);
          let res;
          res = data;
          resolve(res)
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        }
      );
    }).catch(err => {
      this.loading.dismiss();
      console.log(err)
    })
  }

  // create api in node
  async getmyRetailers(info) {
    await this.presentLoading('');
    console.log(info)
    return new Promise(resolve => {
      this.httpclient.post(this.link + '/api/ios/reports/' + info.type + '/' + info.id, { auth_token: localStorage.getItem('token') }, { headers: this.headers }).subscribe(
        data => {
          console.log(data);
        },
        err => {
          this.loading.dismiss();
          alert(JSON.stringify(err));
        });
    }).catch(err => {
      this.loading.dismiss();
      console.log(err)
    })
  }

  ngOnDestroy() {
    // localStorage.removeItem('token');
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

  async getLocation() {

    return new Promise(resolve => {

      this.geolocation.getCurrentPosition().then((data) => {
        // console.log(data.coords);
        this.loadLocations();

        this.location = {
          latlng: data.coords.latitude + '/' + data.coords.longitude,
          lat: data.coords.latitude,
          lon: data.coords.longitude
        }

      }).catch((error) => {
        this.loading.dismiss();

        console.log('Error getting location', error);
      });

      // this.geolocation.watchPosition().subscribe((data) => {
      //   console.log(data.coords);
      //   resolve(data)
      // this.location = data.coords.latitude + '/' + data.coords.longitude;
      // this.location = {
      //   latlng: data.coords.latitude + '/' + data.coords.longitude,
      //   lat: data.coords.latitude,
      //   lon: data.coords.longitude
      // }
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      // });
    }).catch(err => {
      console.log(err)
    })
  }
}
