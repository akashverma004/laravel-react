import { useEffect } from "react";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true);
        axiosClient.get('/users')
            .then(({data}) => {
                setLoading(false)
                console.log(data);
            })
            .catch(() => {
                setLoading(false)
            })
        return (
                <div>
                    Users
                </div>
        )
    }
}