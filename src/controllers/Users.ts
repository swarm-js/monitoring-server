import {
  Accepts,
  Access,
  Delete,
  Description,
  FastifyReply,
  Get,
  Parameter,
  Patch,
  Post,
  Prefix,
  Put,
  Returns,
  Title
} from '@swarmjs/core'
import User from '../models/User'
import { Crud } from '@swarmjs/crud'
import { NotFound } from 'http-errors'

const crud = new Crud(User)

@Title('Users')
@Description('Manages users')
@Prefix('/users')
export default class Users {
  @Get('/')
  @Access('admin')
  @Returns(200, 'UserList', 'List of users')
  @Returns(403, 'Error', 'You cannot access this resource')
  static async list (request: any, reply: FastifyReply) {
    return crud.list(request, reply)
  }

  @Get('/first')
  @Access('admin')
  @Returns(200, 'User', 'First matching user')
  @Returns(403, 'Error', 'You cannot access this resource')
  static async first (request: any, reply: FastifyReply) {
    return crud.first(request, reply)
  }

  @Get('/last')
  @Access('admin')
  @Returns(200, 'User', 'Last matching user')
  @Returns(403, 'Error', 'You cannot access this resource')
  static async last (request: any, reply: FastifyReply) {
    return crud.last(request, reply)
  }

  @Get('/count')
  @Access('admin')
  @Returns(200, 'Count', 'Matching user count')
  @Returns(403, 'Error', 'You cannot access this resource')
  static async count (request: any, reply: FastifyReply) {
    return crud.count(request, reply)
  }

  @Post('/')
  @Access('admin')
  @Accepts('SendInvitation')
  @Returns(200, 'BooleanStatus', 'The invitation has been sent')
  @Returns(409, 'Error', 'A user already exists with this email address')
  @Returns(403, 'Error', 'You cannot invite this user')
  @Returns(500, 'Error', 'Email cannot be sent')
  static async create (request: any) {
    await User.invite(request, request.body.email, request.body.redirect, {
      firstname: request.body.firstname,
      lastname: request.body.lastname
    })
    return { status: true }
  }

  @Get('/:id')
  @Access(['admin', 'user:{id}'])
  @Parameter('id', { type: 'string' }, 'User ID')
  @Returns(200, 'User', 'User')
  @Returns(403, 'Error', 'You cannot access this user')
  @Returns(404, 'Error', 'User not found')
  static async get (request: any, reply: FastifyReply) {
    return crud.get(request, reply)
  }

  @Put('/:id')
  @Access(['admin', 'user:{id}'])
  @Parameter('id', { type: 'string' }, 'User ID')
  @Accepts('User')
  @Returns(200, 'Empty', 'User updated')
  @Returns(201, 'Id', 'User created')
  @Returns(403, 'Error', 'You cannot access this user')
  @Returns(404, 'Error', 'User not found')
  static async replace (request: any, reply: FastifyReply) {
    return crud.replace(request, reply)
  }

  @Patch('/:id')
  @Access(['admin', 'user:{id}'])
  @Parameter('id', { type: 'string' }, 'User ID')
  @Accepts('User')
  @Returns(200, 'Empty', 'User updated')
  @Returns(403, 'Error', 'You cannot access this user')
  @Returns(404, 'Error', 'User not found')
  static async update (request: any, reply: FastifyReply) {
    return crud.update(request, reply)
  }

  @Delete('/:id')
  @Access('admin')
  @Parameter('id', { type: 'string' }, 'User ID')
  @Returns(204, 'Empty', 'User deleted')
  @Returns(403, 'Error', 'You cannot access this user')
  @Returns(404, 'Error', 'User not found')
  static async delete (request: any, reply: FastifyReply) {
    return crud.delete(request, reply)
  }

  @Get('/:id/access')
  @Access('admin')
  @Parameter('id', { type: 'string' }, 'User ID')
  @Returns(200, 'UserAccess', 'User access list')
  @Returns(403, 'Error', 'You cannot access this user')
  @Returns(404, 'Error', 'User not found')
  static async getAccess (request: any) {
    const user = await User.findById(request.params.id)
    if (!user) throw new NotFound()

    return user.swarmUserAccess
  }

  @Put('/:id/access')
  @Access('admin')
  @Parameter('id', { type: 'string' }, 'User ID')
  @Accepts('UserAccess')
  @Returns(200, 'Empty', 'User access list updated')
  @Returns(403, 'Error', 'You cannot access this user')
  @Returns(404, 'Error', 'User not found')
  static async updateAccess (request: any) {
    const user = await User.findById(request.params.id)
    if (!user) throw new NotFound()

    user.swarmUserAccess = request.body

    await user.save()

    return {}
  }
}
