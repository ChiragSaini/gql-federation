import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    extend type Query {
        student(id: Int!): Student
        students: [Student]
    }

    type Student @key(fields: "id") {
        id: Int!
        name: String!
        courses: [Course]
    }

    extend type Course @key(fields: "id"){
        id: Int! @external
    }
`;

const students = {
    1: { name: 'student 1', courses: [1, 3] },
    2: { name: 'student 2', courses: [1, 3] },
    3: { name: 'student 3', courses: [1, 3] },
    4: { name: 'student 4', courses: [1, 2] },
    5: { name: 'student 5', courses: [1, 2] },
    6: { name: 'student 6', courses: [1, 2] },
    7: { name: 'student 7', courses: [2, 3] },
    8: { name: 'student 8', courses: [2, 3] },
    9: { name: 'student 9', courses: [2, 3] },
}

export const resolvers = {
    Student: {
        courses(student) {
            return student.courses.map(id => ({ __typename: 'Course', id }))
        },
        __resolveReference(ref) {
            const student = students[ref.id]
            if (student === undefined) throw new Error(`student ${ref.id} not found`);
            return {
                id: ref.id,
                name: student.name,
                courses: student.courses,
            }
        }
    },
    Query: {
        student: async (_, { id }, context) => {
            const student = students[id];
            if (student === undefined) throw new Error(`Student ${ref.id} not found`);
            return {
                id,
                name: student.name,
                courses: student.courses,
            }
        },
        students: async (_, { }, context) => {
            return Object.entries(students).map(x => {
                const v = x[1];
                return {
                    id: x[0],
                    name: v.name,
                    courses: v.courses,
                }
            })
        },
    }
}