import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    extend type Query {
        course(id: Int!): Course
        courses: [Course]
    }

    type Course @key(fields: "id") {
        id: Int!
        name: String!
        students: [Student]
    }

    extend type Student @key(fields: "id"){
        id: Int! @external
    }
`;

const courses = {
    1: {
        name: 'course 1', students: [1,2,3,4,5,6]
    },
    2: {
        name: 'course 2', students: [4,5,6,7,8,9]
    },
    3: {
        name: 'course 3', students: [1,2,3,7,8,9]
    },
};

export const resolvers = {
    Course: {
        students(course){
            return course.students.map(id => ({ __typename: 'Student', id }))
        },
        __resolveReference(ref){
            const course = courses[ref.id]
            if(course === undefined) throw new Error(`Course ${ref.id} not found`);
            return {
                id: ref.id,
                name: course.name,
                students: course.students,
            }
        }
    },
    Query: {
        course: async (_, {id}, context) => {
            const course = courses[id];
            if(course === undefined) throw new Error(`Course ${ref.id} not found`);
            return {
                id,
                name: course.name,
                students: course.students,
            }
        },
        courses: async (_, {}, context) => {
            return Object.entries(courses).map(x => {
                const v = x[1];
                return {
                    id: x[0],
                    name: v.name,
                    students: v.students,
                }
            })
        },
    }
}