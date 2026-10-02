const express = require('express')
const { neon } = require('@neondatabase/serverless')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const sql = neon(process.env.DATABASE_URL)
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
    try {
        const notes = await prisma.notes.findMany({
            orderBy: {
                id: 'asc'
            }
        })
        res.json(notes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    console.log(req.body)

    const notes = await prisma.notes.create({
        data: {
            author_id: req.body.author_id,
            note: req.body.note
        }
    })

    res.send({
        msg : "Note created",
        id: notes.id
    })
})

router.put('/:id', async (req, res) => {
    console.log(`PUT ${req.params.id}`)
    const notes = await prisma.notes.update({
        where: {
            id: parseInt(req.params.id)
        },
        data: {
            note: req.body.note,
            updated_at: new Date()
        }
    })
    res.json(notes)
})

router.delete('/:id', async (req, res) => {
    console.log(`DELETE ${req.params.id}`)
    const notes = await prisma.notes.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.json(notes)
})
/* router.get('/', async (req, res) => {
    try {
        const notes = await sql`SELECT * FROM notes ORDER BY id`
        res.json(notes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    const { author_id: authorId, note } = req.body

    if (authorId === undefined || note === undefined) {
        return res.status(400).json({ message: 'author_id and note are required' })
    }

    try {
        const [createdNote] = await sql`
            INSERT INTO notes (author_id, note)
            VALUES (${authorId}, ${note})
            RETURNING *
        `
        res.status(201).json(createdNote)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const [updatedNote] = await sql`
            UPDATE notes
            SET author_id = author_id),
                note = note),
                updated_at = now()
            WHERE id = ${req.params.id}
            RETURNING *
        `

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' })
        }

        res.json(updatedNote)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const [deletedNote] = await sql`
            DELETE FROM notes
            WHERE id = ${req.params.id}
            RETURNING *
        `

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' })
        }

        res.json(deletedNote)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}) */

module.exports = router