import UserHistory, { UserHistoryProps } from "../../../components/UserHistory";

export function Threads(props: Omit<UserHistoryProps, "contentType">) {
    return (
        <UserHistory userId={props.userId} contentType="threads" />
    )
}