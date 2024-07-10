import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RepositoryContents = ({ repo }) => {
    const [contents, setContents] = useState([]);

    useEffect(() => {
        const fetchContents = async () => {
            try {
                const response = await axios.get(`https://api.github.com/repos/${repo}/contents`);
                setContents(response.data);
            } catch (error) {
                console.error('Error fetching repository contents:', error);
            }
        };

        if (repo) {
            fetchContents();
        }
    }, [repo]);

    return (
        <div>
            <ul>
                {contents.map((item) => (
                    <li key={item.name}>{item.type === 'dir' ? <strong>{item.name}</strong> : item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default RepositoryContents;
