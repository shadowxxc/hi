import Realm from 'realm'
import schema from './schema-v1'
import {store} from '../store'
import {updateName,updatePhoto} from '../actions/userMyself'
var realm;

export default function openRealm(tokenStr){
  fetch('http://192.168.10.58:9095/api/UserApi/getUser?tokenStr='+tokenStr,{
    method:'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization':tokenStr
    }
  })
  .then((res) => res.json())
  .then((res) => {
      if(!res.err_code) {
        var path = res.obj.username+'.realm';
        realm = new Realm({
          path: path,
          schema: schema,
          schemaVersion:1,
        });
        let Users = realm.objects('User');
        let myself = Users.filtered('username="'+res.obj.username+'"');
        if(!myself){
          realm.write(()=> {
            realm.create('User', {
              username: res.obj.username,
              name: res.obj.name,
              tokenStr:tokenStr
            });
          })
        }else{

        }
        store.dispatch(updateName(res.obj.name));
        if(res.obj.photo){
          store.dispatch(updatePhoto(res.obj.photo));
        }
      }
  })
}
