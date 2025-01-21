import UserHistory, { UserHistoryProps } from "../../../components/UserHistory";

export function Comments(props: Omit<UserHistoryProps, "contentType">) {
    return (
        <UserHistory userId={props.userId} contentType="comments" />
    )
}