import {createSlice} from '@reduxjs/toolkit';

// Slices: 1. name 2. initial value 3. thing is updating
const allCharactersSlice = createSlice({
    name: 'allCharacters',
    initialState: {
        users: {},
    },
    reducers: {
        update(state, action) {
            console.log("allCharactersSlice update updatedUserList: ", action.payload);
            const updatedUserList = action.payload;       
            state.users = updatedUserList;
        },
    }
});

export const { update } = allCharactersSlice.actions;

export default allCharactersSlice.reducer;