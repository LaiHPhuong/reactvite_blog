// export const parseQueryString = (search) => {
//     const params = new URLSearchParams(search);
//     const result = {};

//     for (const [key, value] of params.entries()) {
//         // cố gắng parse JSON trước (filters, object)
//         try {
//             result[key] = JSON.parse(value);
//         } catch {
//             // fallback: convert number
//             if (!isNaN(value) && value !== '') {
//                 result[key] = Number(value);
//             } else {
//                 result[key] = value;
//             }
//         }
//     }

//     return result;
// };

export const parseQueryString = (search) => {
    const params = new URLSearchParams(search);
    const result = {};
    const filters = {};

    for (const [rawKey, rawValue] of params.entries()) {
        let value;

        // parse value: JSON -> number -> string
        try {
            value = JSON.parse(rawValue);
        } catch {
            value = !isNaN(rawValue) && rawValue !== '' ? Number(rawValue) : rawValue;
        }

        // detect filter[key]
        const filterMatch = rawKey.match(/^filter\[(.+)]$/);

        if (filterMatch) {
            const filterKey = filterMatch[1];
            filters[filterKey] = value;
        } else {
            result[rawKey] = value;
        }
    }

    if (Object.keys(filters).length > 0) {
        result.filters = filters;
    }

    return result;
};
/*
    ?q=one&skip=32&filter[status]=published&filter[authorId]=5
    {
    q: 'one',
    skip: 32,
    filters: {
        status: 'published',
        authorId: 5
    }
    }
*/

export const buildQueryString = (params, defaultParams) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        // ❌ bỏ _context khỏi URL
        if (key === '_context') return;
        
        // bỏ qua giá trị mặc định
        if (JSON.stringify(value) === JSON.stringify(defaultParams[key])) return;
        if (value == null || value === '') return;

        query.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    });

    return query.toString();
};
