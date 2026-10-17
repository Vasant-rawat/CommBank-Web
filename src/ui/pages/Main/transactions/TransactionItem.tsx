import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getTag } from '../../../../api/lib'
import { Tag, Transaction } from '../../../../api/types'
import Chip from '../../../components/Chip'

type Props = { transaction: Transaction }

export function TransactionItem(props: Props) {
  const [tags, setTags] = useState<Tag[] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      const results = await Promise.all(props.transaction.tagIds.map((tagId) => getTag(tagId)))
      if (!cancelled) {
        setTags(results.filter((tag): tag is Tag => tag !== null))
      }
    }

    fetchAll()

    return () => {
      cancelled = true
    }
  }, [props.transaction.id])

  return (
    <Container>
      <Content>
        <h6 className="description">{props.transaction.description}</h6>

        {tags ? tags.map((tag) => <Chip key={tag.id} label={tag.name} />) : null}

        <h6 className="datetime">{`${new Date(
          props.transaction.dateTime,
        ).toLocaleDateString()}`}</h6>

        <h6 className="price">{`${
          props.transaction.transactionType === 'Credit'
            ? `$${props.transaction.amount}`
            : `-$${props.transaction.amount}`
        }`}</h6>
      </Content>
      <Divider />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Divider = styled.div`
  width: 100%;
  height: 0.2px;
  background-color: rgba(174, 174, 174, 0.6);
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  h6 {
    font-size: 1.2rem;
  }

  h6.datetime {
    color: rgba(174, 174, 174, 1);
    font-weight: bold;
  }
`
