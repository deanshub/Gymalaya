import { useCallback, useState } from 'react'
import styles from './Program.module.scss'
import { Exercise } from '../Exercise'
import {
    Droppable,
    DragDropContext,
    DroppableProvided,
    DropResult,
} from 'react-beautiful-dnd'
import { Exercise as ExerciseType } from '../../data/types'
import { fetcher } from '../../apiRouter/fetcher'
import { reorder } from '../../data/utils'

export function Program({ name, exercises, index }) {
    const [stateExercises, setExercises] = useState(exercises)
    const updatePlan = useCallback(
        async (username: string, startIndex: number, endIndex: number) => {
            console.log(stateExercises, startIndex, endIndex)
            const optimisticExercies = reorder(
                stateExercises,
                startIndex,
                endIndex,
            )
            console.log(optimisticExercies)
            setExercises(optimisticExercies)

            // const changed = await
            fetcher('/api/plan', {
                body: {
                    username,
                    program: index,
                    startIndex,
                    endIndex,
                },
            })
            // setExercises(changed[index].exercises)
        },
        [stateExercises],
    )

    function onDragEnd(result: DropResult) {
        if (!result.destination) {
            return
        }

        if (result.destination.index === result.source.index) {
            return
        }

        // console.log(result)
        updatePlan('dean', result.source.index, result.destination.index)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th colSpan={5}>{name}</th>
                    </tr>
                    <tr>
                        <th rowSpan={2}>Group</th>
                        <th rowSpan={2}>Exercise</th>
                        <th colSpan={3}>Power</th>
                    </tr>
                    <tr>
                        <th>Reps</th>
                        <th>Sets</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <Droppable droppableId={name}>
                    {(provided: DroppableProvided) => (
                        <tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {stateExercises.map(
                                (exercise: ExerciseType, index: number) => (
                                    <Exercise
                                        {...exercise}
                                        index={index}
                                        key={`${exercise.group}.${exercise.name}`.replace(
                                            / /g,
                                            '-',
                                        )}
                                    />
                                ),
                            )}
                            {provided.placeholder}
                        </tbody>
                    )}
                </Droppable>
            </table>
        </DragDropContext>
    )
}
