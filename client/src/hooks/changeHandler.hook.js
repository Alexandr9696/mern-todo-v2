export const useChangeHandler = () => {

  const changeHandler = (event, fn, state) => {
    fn({...state, [event.target.name]: event.target.value} )
  }

  return {changeHandler}
}