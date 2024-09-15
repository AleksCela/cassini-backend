const express = require('express');
const knex = require('knex')(require('./knexfile').development);
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());


// Add a new report
app.post('/reports', async (req, res) => {
    const { longitude, latitude, category, description } = req.body;
    try {
        const [id] = await knex('reports').insert({
            longitude,
            latitude,
            category, // Include category if it is added to your schema
            description // Include description
        });
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get monthly report statistics
app.get('/reports/monthly-stats', async (req, res) => {
    try {
        const stats = await knex('reports')
            .select(knex.raw('strftime("%Y-%m", time_reported) as month'))
            .count('id as total')
            .sum('case when is_completed then 1 else 0 end as completed')
            .groupBy('month')
            .orderBy('month', 'asc');

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch monthly report stats' });
    }
});

// Complete a report
app.post('/reports/:id/complete', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await knex('reports')
            .where({ id })
            .update({ is_completed: true, time_completed: knex.fn.now() });

        if (result) {
            res.status(200).json({ message: 'Report marked as completed' });
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update report' });
    }
});

// Get all reports
app.get('/reports', async (req, res) => {
    try {
        const reports = await knex('reports').select();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// Get reports for the current day
app.get('/reports/today', async (req, res) => {
    try {
        const reports = await knex('reports')
            .whereRaw('date(time_reported) = date("now")')
            .select();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch today\'s reports' });
    }
});

// Get report statistics for a day (completed/reported)
app.get('/reports/stats', async (req, res) => {
    try {
        const stats = await knex('reports')
            .select(knex.raw('count(*) as reported, sum(case when is_completed then 1 else 0 end) as completed'))
            .whereRaw('date(time_reported) = date("now")')
            .first();

        res.json({
            month: 'Today',
            reported: stats.reported,
            completed: stats.completed
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch report stats' });
    }
});

// Get recent completed reports
app.get('/reports/recent-completed', async (req, res) => {
    try {
        const reports = await knex('reports')
            .where({ is_completed: true })
            .orderBy('time_completed', 'desc')
            .limit(8);

        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent completed reports' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
