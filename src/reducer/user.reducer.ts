
export default function userReducer(state:any = {id:0,doctor:false}, action: any): any {
  switch (action.type) {
    case 'get-user':
      return { ...state, ...action.payload };
  }
}