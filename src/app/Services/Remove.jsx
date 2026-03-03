"use client"
import { useRouter } from 'next/navigation';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function Remove(props) {
    const userID = props.id;
    console.log(userID);

    const router = useRouter();

    const deleteUser = async () => {
        let result = await fetch(`${baseUrl}/api/list/${userID}`, {
            method: "Delete",
        });
        let response = await result.json();
        if (response.success) {
            alert("user is deleted");
            console.log(response);
        }
        // router.refresh();
        // router.back();
    }


    return <div>
        <button onClick={deleteUser}>Delete</button>
    </div>
}