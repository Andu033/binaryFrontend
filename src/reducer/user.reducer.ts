
export default function userReducer(state:any = {id:0}, action: any): any {
  switch (action.type) {
    case 'get-user':
      return { ...state, id:action.payload };
  }
}