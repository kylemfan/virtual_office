import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import CanvasContext from './CanvasContext';

import {MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE} from './mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {checkMapCollision} from './utils';
import {update as updateAllCharactersData} from './slices/allCharactersSlice'
import { firebaseDatabase } from '../firebase/firebase';
import { set, ref } from 'firebase/database';

const GameLoop = ({children, allCharactersData, updateAllCharactersData}) => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    useEffect(() => {
        // frameCount used for re-rendering child components
        console.log("initial setContext");
        setContext({canvas: canvasRef.current.getContext('2d'), frameCount: 0});
    }, [setContext]);

    // keeps the reference to the main rendering loop
    const loopRef = useRef();
    const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];

    const moveMyCharacter = useCallback((e) => {
        var currentPosition = mycharacterData.position;
        const key = e.key;
        if (MOVE_DIRECTIONS[key]) {
            // ***********************************************
            // TODO: Add your move logic here
            // Steps:
            // 1. Calculate new position (get from moveDirections to calculate new position)
            // 2. Update position (using updateAllCharactersData() from mycharacter.js)

            // Calculate position delta based on keypress:
            const updatedX = currentPosition.x + MOVE_DIRECTIONS[key][0];
            const updatedY = currentPosition.y + MOVE_DIRECTIONS[key][1];
            
            // Writes character's new position in position value (to firebase)
            const positionRef = ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id + '/position');
            set(positionRef, {x: updatedX, y: updatedY});

            // Writes character's new position in position value
            // updatedAllCharacterData object to be passed into updateAllCharactersData() to update
            // const updatedAllCharacterData = {
            //     ...allCharactersData,                    // FIXME: might not need
            //     [MY_CHARACTER_INIT_CONFIG.id]: {
            //         ...mycharacterData,
            //         position: {x: updatedX, y: updatedY}
            //     }
            // };
            
            // Will update character passed in as arg (updatedAllCharacterData)
            // FIXME: writes to redux, want to write to firebase instead
            // updateAllCharactersData(updatedAllCharacterData);
        }
    }, [mycharacterData]);

    const tick = useCallback(() => {
        if (context != null) {
            setContext({canvas: context.canvas, frameCount: (context.frameCount + 1) % 60});
        }
        loopRef.current = requestAnimationFrame(tick);
    }, [context]);

    useEffect(() => {   
        loopRef.current = requestAnimationFrame(tick);
        return () => {
            loopRef.current && cancelAnimationFrame(loopRef.current);
        }
    }, [loopRef, tick])

    useEffect(() => {
        // IMPORTANT: when key pressed, call moveMyCharacter (callback)
        document.addEventListener('keypress', moveMyCharacter);
        return () => {
            document.removeEventListener('keypress', moveMyCharacter);
        }
    }, [moveMyCharacter]);

    return (
        <CanvasContext.Provider value={context}>
            <canvas
                ref={canvasRef} 
                width={TILE_SIZE * MAP_DIMENSIONS.COLS}
                height={TILE_SIZE * MAP_DIMENSIONS.ROWS}
                class="main-canvas"
            />
            {children}
            {/* v ? v */}
            <FirebaseListener/>
        </CanvasContext.Provider>
    );
};

const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

// MIGHT HAVE TO CHANGE TO SET FUNCTION FROM FIREBASE
const mapDispatch = {updateAllCharactersData};

export default connect(mapStateToProps, mapDispatch)(GameLoop);