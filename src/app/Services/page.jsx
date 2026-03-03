
import Link from "next/link";
import Remove from "./Remove";
import { API_BASE_URLS } from "../../../config/constant";

async function GetAPIData() {
    try {
        const res = await fetch(`${API_BASE_URLS}/api/list`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch API data');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching API:', error);
        return []; // return empty array on error
    }
}

export default async function Page() {
    const GetUser = await GetAPIData();

    return (
        <div>
            <h1>Services Page</h1>
            <ul>
                {GetUser.map((item) => (
                    <li key={item.id}>
                        <p>ID : {item.id}</p>
                        <p>Name : {item.name}</p>
                        <p>Email : {item.email}</p>
                        <p>Cell : {item.cell}</p>
                        <p>Age : {item.age}</p>
                        <Link href={`/Services/${item.id}`}>View</Link>
                        <br />
                        <Link href={`/Services/${item.id}/update/`}>Edit</Link>
                        <br />
                        <Remove id={item.id} />
                        <br />
                        <br />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function generateMetadata() {
    return {
        title: 'Services Page Title',
        description: 'Services Page Description',
    };
}