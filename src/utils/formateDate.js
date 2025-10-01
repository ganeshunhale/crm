export const getDateRange = (days) => {
        const to = new Date(); // now
        const from = new Date();
        
        from.setDate(from.getDate() - days); // subtract days

        // Format to "YYYY-MM-DD HH:mm:ss.SSSSSS"
        const formatDate = (date) =>
            date.toISOString().replace('T', ' ').replace('Z', '');

        return {
            from: formatDate(from),
            to: formatDate(to),
        };
    };